import { evaluateJSExpression } from "../../utils/evaluateJSExpression.js";
import { camelToKebabCase } from "../../utils/camelToKebabCase.ts";
import { replaceInterpolationMarkers } from "../../utils/formatTemplate.ts";
import { bindForDirective } from "./../compiler/directives/for.js";
import { bindIfDirective } from "./../compiler/directives/if";
import { bindClassDirective } from "./../compiler/directives/class";
import { bindStyleDirective } from "./../compiler/directives/style";
import { mountStyling } from "../../src/compiler/mountStyling";
import {
    getTranslatedAttributeNames,
    translateBindingAttribute,
    translateEventAttribute,
} from "../../utils/getTranslatedAttributeNames.ts";
import {
    reactiveArray,
    reactiveVariable,
} from "../../reactivity/reactiveVariable.ts";
import {
    REACTIVE_VARIABLE_REF_CONFIG,
    REACTIVE_VARIABLE_COMPUTED_CONFIG,
    REACTIVE_VARIABLE_PROP_CONFIG,
    REACTIVE_VARIABLE_ARRAY_CONFIG,
    LIFECYCLE_CALLBACKS_TEMPLATE,
    STANDARD_INPUT_TYPES,
    INPUT_TYPES_WITH_CHECKED_ATTRIBUTE,
} from "../../configuration/constants.ts";

const compilerMacros = {
    ref: (value) => {
        if (Object.keys(value).includes("value")) {
            throw new Error('Ref macro function must not contain "value" key.');
        }

        if (Array.isArray(value)) {
            return reactiveArray(
                value,
                structuredClone(REACTIVE_VARIABLE_ARRAY_CONFIG)
            );
        }

        return reactiveVariable(
            value,
            structuredClone(REACTIVE_VARIABLE_REF_CONFIG)
        );
    },
    computed: (callback) => {
        if (typeof callback !== "function") {
            throw new Error(
                `Computed macro function must have function as its parameter.`
            );
        }

        return reactiveVariable(
            callback,
            structuredClone(REACTIVE_VARIABLE_COMPUTED_CONFIG)
        );
    },
    watch: (source, callback, watchConfiguration = {}) => {
        const isSourceAFunction = typeof source === "function";
        const isSourceAnArray = Array.isArray(source);

        const { immediate = false } = watchConfiguration;

        const setWatchCallback = (sourceElement) => {
            $VindEngine.dependencyExtractorRunning = true;

            const callbackValue = sourceElement();

            if ($VindEngine.extractedDependencies.size > 0) {
                const extractedDependencies = Array.from(
                    $VindEngine.extractedDependencies
                );

                if (extractedDependencies.length > 0) {
                    extractedDependencies.forEach((extractedDependency) => {
                        $VindEngine.watchCallbacks[extractedDependency].push(callback);
                    });
                }

                $VindEngine.extractedDependencies.clear();
            }

            $VindEngine.dependencyExtractorRunning = false;

            return callbackValue;
        };

        if (isSourceAFunction) {
            const callbackValue = setWatchCallback(source);

            if (immediate) {
                callback(callbackValue, callbackValue);
            }

            return;
        }

        if (isSourceAnArray) {
            source.forEach((sourceFunction) => {
                setWatchCallback(sourceFunction);
            });

            return;
        }
    },
};

export function compileComponent(
    componentFunction,
    componentParentElement,
    parentContext = {},
    componentName
) {
    if (!componentFunction) throw new Error("Component function is not defined.");
    if (!componentParentElement)
        throw new Error("Component parent element is not defined.");
    if (!componentName) throw new Error("Component name is not defined.");

    componentParentElement.$VindNode ??= {};
    componentParentElement.$VindNode.properties ??= {};

    const upperCaseComponentName = componentName.toUpperCase();

    const lifecycleCallbacks = structuredClone(LIFECYCLE_CALLBACKS_TEMPLATE);
    const properties = componentParentElement.$VindNode.properties;

    // Defining component's destructurable properties.
    const componentInternalContext = {
        ...compilerMacros,
        onMounted: (callback) => {
            if (typeof callback !== "function") {
                throw new Error("onMounted's callback must be a function.");
            }

            lifecycleCallbacks.onMounted = callback;
        },
        onBeforeMount: (callback) => {
            if (typeof callback !== "function") {
                throw new Error("onBeforeMount's callback must be a function");
            }

            lifecycleCallbacks.onBeforeMount = callback;
        },
        $emit: (eventName, payload, eventInitDict = { bubbles: true }) => {
            if (!eventName || typeof eventName !== "string") {
                return;
            }

            eventInitDict.detail = payload;

            const customEvent = new CustomEvent(eventName, eventInitDict);

            componentParentElement.dispatchEvent(customEvent);
        },
        $stores: $VindEngine.stores,
        $router: $VindEngine.stores.routerStore,
        $props: componentParentElement.$VindNode.properties,
    };

    // Binding props and transforming them into reactive variables.
    let componentProperties =
        $VindEngine.propertiesByComponent[componentParentElement.tagName] || {}; //  - in case the parent element's tagName is 'DIV'.

    Object.entries(componentProperties).forEach(
        ([propertyKey, propertyConfiguration]) => {
            const attributeExpression = componentParentElement.getAttribute(
                `data-vind-origin-of-binding-attribute-${propertyKey}`
            );

            const propertyReactiveVariable = reactiveVariable(
                undefined,
                structuredClone(REACTIVE_VARIABLE_PROP_CONFIG)
            );

            properties[propertyKey] = propertyReactiveVariable;

            // componentProperties.isValid = reactiveVariable(false, )

            if (
                propertyConfiguration.required ||
                typeof propertyConfiguration.required === "undefined"
            ) {
                console.warn(
                    `Property "${propertyKey}" of component "${componentName}" is required but is either unused or null.`
                );
            }

            $VindEngine.queueReactiveEffect({
                effect: () => {
                    const evaluatedJSExpression = evaluateJSExpression(
                        parentContext,
                        attributeExpression
                    );

                    if (
                        evaluatedJSExpression !== null &&
                        propertyConfiguration.type &&
                        evaluatedJSExpression?.constructor !== propertyConfiguration.type
                    ) {
                        console.warn(
                            `Type of passed "${propertyKey}" property does not match the type defined in its configuration. Expetected "${propertyConfiguration.type
                            }" but got "${typeof evaluatedJSExpression}" instead.`
                        );
                    }

                    if (
                        propertyConfiguration.validator &&
                        !propertyConfiguration.validator(evaluatedJSExpression)
                    ) {
                        // TODO: Decide what to do if property does not pass the validation.
                        // console.warn(`Validation of property "${propertyKey}" failed.`);
                    }

                    propertyReactiveVariable.value =
                        evaluatedJSExpression ||
                        propertyConfiguration?.default ||
                        evaluatedJSExpression;
                },
            });

            if ("default" in propertyConfiguration) {
                delete propertyConfiguration.default;
            }
        }
    );

    // Calling a component function with the context methods. The component function returns a context object.
    // It is fine to think of it as Vue's onCreated lifecycle hook.
    const stringifiedComponentFunction = componentFunction.toString();

    const evaluatedComponentFunction = evaluateJSExpression(
        componentInternalContext,
        stringifiedComponentFunction
    );

    const componentContext = Object.assign(
        properties,
        evaluatedComponentFunction()
    );

    // Setting properties on componentContext that can be later referenced in templates by preprending them with '$' sign.
    componentContext.$stringify = $VindEngine.$stringify;
    componentContext.$stores = $VindEngine.stores;
    componentContext.$router = $VindEngine.stores.routerStore;
    componentContext.$path = $VindEngine.stores.routerStore.path;
    componentContext.$emit = (eventName) => () =>
        componentInternalContext.$emit(eventName);

    // Setting componentParentElement's innerHTML to the component's template and removing the 'template' property.
    const componentTemplate =
        $VindEngine.templateContentByComponent[upperCaseComponentName] || "";

    // Invoking onBeforeMount lifecycle hook if defined.
    lifecycleCallbacks.onBeforeMount?.();

    // After running this instruction component gets its HTML content set.
    componentParentElement.innerHTML =
        replaceInterpolationMarkers(componentTemplate);

    const componentStyle =
        $VindEngine.styleContentByComponent[upperCaseComponentName] || "";

    // Grabbing all inner elements of the componentParentElement that has just been created by innerHTML property.
    let componentInnerElements = [
        ...componentParentElement.querySelectorAll(
            "*:not([data-vind-compiled-component]):not([\\:for] *)"
        ),
    ];

    // Formatting every inner element in order for easier manipulation.
    let mappedInnerElements = componentInnerElements.map((element) => {
        const attributes = [...element.attributes];

        return {
            element,
            attributes: getTranslatedAttributeNames(attributes),
        };
    });

    // Determining component drawers.
    const drawerElements = [...componentParentElement.querySelectorAll("Drawer")];
    const mappedInnerDrawerTags = drawerElements.map((drawerElement) => {
        const drawerName = drawerElement.getAttribute("name");

        const targetInsertTag =
            componentParentElement.$VindNode?.mappedInnerInsertTags?.find(
                (insertTag) => insertTag.name === drawerName
            );

        if (targetInsertTag) {
            drawerElement.prepend(targetInsertTag.insertElement);
        }

        return {
            element: drawerElement,
            name: drawerElement.getAttribute("name"),
        };
    });

    const componentNamesUsed = new Set();

    // The famous "mounting" step. This is where the magic happens.
    mappedInnerElements.forEach((mappedElement) => {
        const element = mappedElement.element;

        const componentModule = $VindEngine.componentModules[element.tagName];

        // Testing if the element of the current loop iteration has its corresponding defined component.
        // div => fail
        // eg. Card => pass
        if (componentModule) {
            componentNamesUsed.add(element.tagName);

            element.$VindNode = {};

            const insertTags = [...element.querySelectorAll("Insert")];
            const mappedInnerInsertTags = insertTags.map((insertElement) => {
                return {
                    insertElement,
                    name: insertElement.getAttribute("name"),
                };
            });

            element.$VindNode.mappedInnerInsertTags = mappedInnerInsertTags;
        }

        // eventAttributes
        // Mounting event attributes that start with '@' character.
        mappedElement.attributes.eventAttributes.forEach(
            ({ name: eventBindingAttribute, value: attributeValue }) => {
                const evaluatedCallaback = (event) =>
                    evaluateJSExpression(componentContext, attributeValue)?.(event);

                element.addEventListener(
                    translateEventAttribute(eventBindingAttribute),
                    evaluatedCallaback
                );
            }
        );

        // bindingAttributes
        // Mounting binding attributes that start with ':' character.
        mappedElement.attributes.bindingAttributes.forEach(
            ({ name: bindingAttribute, value: attributeValue }) => {
                const translatedBindingAttribute =
                    translateBindingAttribute(bindingAttribute);

                element.setAttribute(
                    `data-vind-origin-of-binding-attribute-${translatedBindingAttribute}`,
                    attributeValue
                );

                // Note: for loop is mounted separately from other elements and has its own mounting (copied) step.
                // TODO: This may include doubled mounting of loop's attributes. Check if it is necessary.
                if (bindingAttribute === ":for") {
                    if (componentModule) {
                        throw new Error(
                            `Component "${element.tagName}" cannot have a loop directive. It must be wrapped in a div or another HTML element.`
                        );
                    }

                    bindForDirective(mappedElement, componentContext);

                    return;
                }

                if (bindingAttribute === ":style") {
                    bindStyleDirective(element, componentContext);

                    return;
                }

                if (bindingAttribute === ":class") {
                    bindClassDirective(element, componentContext);

                    return;
                }

                if (bindingAttribute === ":if") {
                    bindIfDirective(element, componentContext);

                    return;
                }

                // Mounting input elements' value and checked attributes.
                const isAnInputElement = element.tagName === "INPUT";

                const inputType = element.getAttribute("type") || "text";

                if (isAnInputElement && bindingAttribute === ":model") {
                    const isStandardInputType = STANDARD_INPUT_TYPES.includes(inputType);

                    const isInputTypeWithCheckedAttribute =
                        INPUT_TYPES_WITH_CHECKED_ATTRIBUTE.includes(inputType);

                    if (attributeValue) {
                        let proxy = undefined;

                        const isModelAttributeNested = attributeValue.includes(".");

                        if (isModelAttributeNested) {
                            const objectTokens = attributeValue.split(".");

                            const lastProperty = objectTokens[objectTokens.length - 1];

                            const modelObject = objectTokens.slice(0, -1).join(".");

                            proxy = evaluateJSExpression(componentContext, modelObject);

                            if (isStandardInputType) {
                                element.addEventListener("input", (event) => {
                                    proxy[lastProperty] = event.target.value;
                                });
                            } else if (isInputTypeWithCheckedAttribute) {
                                element.addEventListener("input", (event) => {
                                    proxy[lastProperty] = event.target.checked;
                                });
                            }
                        }

                        if (!isModelAttributeNested) {
                            proxy = evaluateJSExpression(componentContext, attributeValue);

                            if (isStandardInputType) {
                                element.addEventListener("input", (event) => {
                                    proxy.value = event.target.value;
                                });
                            } else if (isInputTypeWithCheckedAttribute) {
                                element.addEventListener("input", (event) => {
                                    proxy.value = event.target.checked;
                                });
                            }
                        }

                        let expression = isModelAttributeNested
                            ? attributeValue
                            : `${attributeValue}.value`;

                        if (isStandardInputType) {
                            $VindEngine.queueReactiveEffect({
                                effect: () => {
                                    const evaluatedExpression = evaluateJSExpression(
                                        componentContext,
                                        expression
                                    );

                                    element.setAttribute("value", evaluatedExpression);

                                    element.value = evaluatedExpression;
                                },
                            });

                            return;
                        }

                        if (isInputTypeWithCheckedAttribute) {
                            $VindEngine.queueReactiveEffect({
                                effect: () => {
                                    const condition = evaluateJSExpression(
                                        componentContext,
                                        expression
                                    );

                                    if (condition) {
                                        element.setAttribute("checked", condition);
                                    } else {
                                        element.removeAttribute("checked");
                                    }

                                    element.checked = condition;
                                },
                            });

                            return;
                        }
                    }
                }

                if (isAnInputElement && bindingAttribute === ":value") {
                    if (STANDARD_INPUT_TYPES.includes(inputType)) {
                        $VindEngine.queueReactiveEffect({
                            effect: () => {
                                const evaluatedExpression = evaluateJSExpression(
                                    componentContext,
                                    attributeValue
                                );

                                element.setAttribute("value", evaluatedExpression);

                                element.value = evaluatedExpression;
                            },
                        });

                        return;
                    }
                }

                if (isAnInputElement && bindingAttribute === ":checked") {
                    if (INPUT_TYPES_WITH_CHECKED_ATTRIBUTE.includes(inputType)) {
                        $VindEngine.queueReactiveEffect({
                            effect: () => {
                                const condition = evaluateJSExpression(
                                    componentContext,
                                    attributeValue
                                );

                                if (condition) {
                                    element.setAttribute("checked", condition);
                                } else {
                                    element.removeAttribute("checked");
                                }

                                element.checked = condition;
                            },
                        });

                        return;
                    }
                }

                // Mounting any other attribute that is not a directive.
                $VindEngine.queueReactiveEffect({
                    effect: () => {
                        const evaluatedExpression = evaluateJSExpression(
                            componentContext,
                            attributeValue
                        );

                        element.setAttribute(
                            translatedBindingAttribute,
                            evaluatedExpression
                        );
                    },
                });
            }
        );
    });

    // This is used to bind reactive variables to the DOM and evaluate expressions inside {{ }} delimiters.
    const interpolationElements = [
        ...componentParentElement.querySelectorAll("vind-expression"),
    ];

    interpolationElements.forEach((interpolationElement) => {
        const expression = interpolationElement.textContent;

        const textNode = document.createTextNode("");

        interpolationElement.parentNode.insertBefore(
            textNode,
            interpolationElement
        );
        interpolationElement.parentNode.removeChild(interpolationElement);

        $VindEngine.queueReactiveEffect({
            effect: () => {
                textNode.textContent = evaluateJSExpression(
                    componentContext,
                    expression
                );
            },
        });
    });
    if (!$VindEngine.componentsWithStyleMounted.has(upperCaseComponentName)) {
        mountStyling(componentStyle, upperCaseComponentName);

        $VindEngine.componentsWithStyleMounted.add(upperCaseComponentName);
    }

    // Calling the onMounted lifecycle callback if it exists
    lifecycleCallbacks.onMounted?.();

    return {
        componentParentElement,
        componentNamesUsed,
        nextParentContext: componentContext,
    };
}

export function templateCompiler(
    componentFunction,
    lookUpElement,
    parentContext,
    parentComponentName,
    configuration = {}
) {
    let componentElements = [];
    let foundElements = [];

    const { defaultEntryPointId } = configuration;

    if (defaultEntryPointId) {
        foundElements = lookUpElement.querySelectorAll(defaultEntryPointId);

        delete configuration.defaultEntryPointId;
    } else if (parentComponentName) {
        foundElements = lookUpElement.querySelectorAll(
            `${parentComponentName}:not([data-vind-compiled-component])`
        );
    } else {
        throw new Error("Parent component name is required.");
    }

    componentElements = Array.from(foundElements);

    componentElements.forEach((componentElement) => {
        const { componentParentElement, componentNamesUsed, nextParentContext } =
            compileComponent(
                componentFunction,
                componentElement,
                parentContext,
                parentComponentName
            );

        if (componentNamesUsed.has(parentComponentName)) {
            throw new Error(
                `Component "${parentComponentName}" is referenced inside its body.`
            );
        }

        componentElement.setAttribute("data-vind-compiled-component", true);

        componentElement.prepend(...componentParentElement.childNodes);

        const uniqueComponentNamesUsed = Array.from(componentNamesUsed);

        uniqueComponentNamesUsed.forEach((usedComponentName) => {
            const componentModule = $VindEngine.componentModules[usedComponentName];

            const { componentFunction, componentName: nextComponentName } =
                componentModule;

            templateCompiler(
                componentFunction,
                componentElement,
                nextParentContext,
                nextComponentName,
                configuration
            );
        });
    });
}
