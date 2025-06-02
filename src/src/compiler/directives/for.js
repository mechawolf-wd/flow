import { extractLoopDescriptors } from "../../../utils/extractLoopDescriptors.ts";
import { evaluateJSExpression } from "../../../utils/evaluateJSExpression.js";
import {
    getTranslatedAttributeNames,
    translateBindingAttribute,
    translateEventAttribute,
} from "../../../utils/getTranslatedAttributeNames.ts";
import { bindIfDirective } from "./if";
import { bindClassDirective } from "./class";
import { bindStyleDirective } from "./style";
import { templateCompiler } from "../templateCompiler.js";
import {
    STANDARD_INPUT_TYPES,
    INPUT_TYPES_WITH_CHECKED_ATTRIBUTE,
} from "../../../configuration/constants.ts";

export const bindForDirective = (mappedLoopElement, elementContext) => {
    const parentElement = mappedLoopElement.element;

    const forAttributeContent = parentElement.getAttribute(":for");

    const loopDescriptors = extractLoopDescriptors(forAttributeContent);

    if (loopDescriptors.itemName in elementContext) {
        throw new Error(
            `The item name "${loopDescriptors.itemName}" is already used in the current context.`
        );
    }

    let evaluatedTargetArray = evaluateJSExpression(
        elementContext,
        loopDescriptors.arrayExpression
    );

    if (!evaluatedTargetArray) {
        parentElement.innerHTML = "";

        return;
    }

    const loopHTMLItemTemplate = parentElement.innerHTML;

    let usedComponentNames = new Set();

    const reactiveVariableEntries = Object.entries($VindEngine.reactiveVariables);

    const reactiveArrayReferingObject = reactiveVariableEntries.find(
        ([, value]) => {
            return value.variableProxy === evaluatedTargetArray;
        }
    );

    const [arrayReference] = reactiveArrayReferingObject || [];

    const mountNewLoopElement = (arrayElement) => {
        const currentLoopedElement = document.createElement("div");

        currentLoopedElement.innerHTML = loopHTMLItemTemplate;

        const loopedElementChildNodes = [
            ...currentLoopedElement.querySelectorAll("*:not([\\:for] *)"),
        ];

        let loopMappedInnerElement = loopedElementChildNodes.map((element) => {
            const attributes = [...element.attributes];

            return {
                element,
                attributes: getTranslatedAttributeNames(attributes),
            };
        });

        const drawerElements = [...parentElement.querySelectorAll("Drawer")];

        drawerElements.map((drawerElement) => {
            const drawerName = drawerElement.getAttribute("name");

            const targetInsertTag =
                parentElement.$VindNode?.mappedInnerInsertTags.find(
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

        const loopedElementContext = {
            ...elementContext,
            [loopDescriptors.itemName]: arrayElement,
        };

        if (loopDescriptors.indexName) {
            const element = evaluatedTargetArray.$VindReactiveArray.find(
                ({ element }) => {
                    return element === arrayElement;
                }
            );

            loopedElementContext[loopDescriptors.indexName] = element?.index;
        }

        loopMappedInnerElement.forEach((loopChildElement) => {
            const loopedElement = loopChildElement.element;

            const componentModule =
                $VindEngine.componentModules[loopedElement.tagName];

            if (componentModule) {
                usedComponentNames.add(loopedElement.tagName);

                loopedElement.$VindNode = {};

                const insertTags = [...loopedElement.querySelectorAll("Insert")];
                const mappedInnerInsertTags = insertTags.map((insertElement) => {
                    return {
                        insertElement,
                        name: insertElement.getAttribute("name"),
                    };
                });

                loopedElement.$VindNode.mappedInnerInsertTags = mappedInnerInsertTags;
            }

            loopChildElement.attributes.eventAttributes.forEach(
                ({ name: eventBindingAttribute, value: attributeValue }) => {
                    const evaluatedCallaback = (event) => {
                        const expression = evaluateJSExpression(
                            loopedElementContext,
                            attributeValue
                        );

                        if (typeof expression === "function") {
                            return expression(event);
                        }
                    };

                    loopedElement.addEventListener(
                        translateEventAttribute(eventBindingAttribute),
                        evaluatedCallaback
                    );
                }
            );

            loopChildElement.attributes.bindingAttributes.forEach(
                ({ name: bindingAttribute, value: attributeValue }) => {
                    const translatedBindingAttribute =
                        translateBindingAttribute(bindingAttribute);

                    loopedElement.setAttribute(
                        `data-vind-origin-of-binding-attribute-${translatedBindingAttribute}`,
                        attributeValue
                    );

                    if (bindingAttribute === ":style") {
                        bindStyleDirective(loopedElement, componentContext);

                        return;
                    }

                    if (bindingAttribute === ":class") {
                        bindClassDirective(loopedElement, loopedElementContext);

                        return;
                    }

                    if (bindingAttribute === ":if") {
                        bindIfDirective(loopedElement, loopedElementContext);

                        return;
                    }

                    if (bindingAttribute === ":for") {
                        if (componentModule) {
                            throw new Error(
                                `Component "${parentElement.tagName}" cannot have a loop directive. It must be wrapped in a div or another HTML element.`
                            );
                        }

                        bindForDirective(loopChildElement, loopedElementContext);

                        return;
                    }

                    const isElementAnInputElement = loopedElement.tagName === "INPUT";

                    const inputType = loopedElement.getAttribute("type") || "text";

                    if (isElementAnInputElement && bindingAttribute === ":model") {
                        const isStandardInputType =
                            STANDARD_INPUT_TYPES.includes(inputType);
                        const isInputTypeWithCheckedAttribute =
                            INPUT_TYPES_WITH_CHECKED_ATTRIBUTE.includes(inputType);

                        if (attributeValue) {
                            let proxy = undefined;

                            const isModelAttributeNested = attributeValue.includes(".");

                            if (isModelAttributeNested) {
                                const objectTokens = attributeValue.split(".");

                                const lastProperty = objectTokens[objectTokens.length - 1];

                                const modelObject = objectTokens.slice(0, -1).join(".");

                                proxy = evaluateJSExpression(loopedElementContext, modelObject);

                                if (isStandardInputType) {
                                    loopedElement.addEventListener("input", (event) => {
                                        proxy[lastProperty] = event.target.value;
                                    });
                                } else if (isInputTypeWithCheckedAttribute) {
                                    loopedElement.addEventListener("input", (event) => {
                                        proxy[lastProperty] = event.target.checked;
                                    });
                                }
                            }

                            if (!isModelAttributeNested) {
                                proxy = evaluateJSExpression(
                                    loopedElementContext,
                                    attributeValue
                                );

                                if (isStandardInputType) {
                                    loopedElement.addEventListener("input", (event) => {
                                        proxy.value = event.target.value;
                                    });
                                } else if (isInputTypeWithCheckedAttribute) {
                                    loopedElement.addEventListener("input", (event) => {
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
                                            loopedElementContext,
                                            expression
                                        );

                                        loopedElement.setAttribute("value", evaluatedExpression);

                                        loopedElement.value = evaluatedExpression;
                                    },
                                });

                                return;
                            }

                            if (isInputTypeWithCheckedAttribute) {
                                $VindEngine.queueReactiveEffect({
                                    effect: () => {
                                        const condition = evaluateJSExpression(
                                            loopedElementContext,
                                            expression
                                        );

                                        if (condition) {
                                            loopedElement.setAttribute("checked", condition);
                                        } else {
                                            loopedElement.removeAttribute("checked");
                                        }

                                        loopedElement.checked = condition;
                                    },
                                });

                                return;
                            }
                        }
                    }

                    if (isElementAnInputElement && bindingAttribute === ":value") {
                        if (STANDARD_INPUT_TYPES.includes(inputType)) {
                            $VindEngine.queueReactiveEffect({
                                effect: () => {
                                    const evaluatedExpression = evaluateJSExpression(
                                        loopedElementContext,
                                        attributeValue
                                    );

                                    loopedElement.setAttribute("value", evaluatedExpression);

                                    loopedElement.value = evaluatedExpression;
                                },
                            });

                            return;
                        }
                    }

                    if (isElementAnInputElement && bindingAttribute === ":checked") {
                        if (INPUT_TYPES_WITH_CHECKED_ATTRIBUTE.includes(inputType)) {
                            $VindEngine.queueReactiveEffect({
                                effect: () => {
                                    const condition = evaluateJSExpression(
                                        loopedElementContext,
                                        attributeValue
                                    );

                                    if (condition) {
                                        loopedElement.setAttribute("checked", condition);
                                    } else {
                                        loopedElement.removeAttribute("checked");
                                    }

                                    loopedElement.checked = condition;
                                },
                            });

                            return;
                        }
                    }

                    $VindEngine.queueReactiveEffect({
                        effect: () => {
                            loopedElement.setAttribute(
                                translateBindingAttribute(bindingAttribute),
                                evaluateJSExpression(loopedElementContext, attributeValue)
                            );
                        },
                    });
                }
            );
        });

        const interpolationElements = [
            ...currentLoopedElement.querySelectorAll("vind-expression"),
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
                        loopedElementContext,
                        expression
                    );
                },
            });
        });

        const uniqueComponentNamesUsed = Array.from(usedComponentNames);

        uniqueComponentNamesUsed.forEach((componentTagName) => {
            const { componentFunction, componentName } =
                $VindEngine.componentModules[componentTagName];

            templateCompiler(
                componentFunction,
                currentLoopedElement,
                loopedElementContext,
                componentName
            );
        });

        return currentLoopedElement.childNodes;
    };

    const effect = () => {
        parentElement.innerHTML = "";

        evaluatedTargetArray.forEach((arrayElement) => {
            const childNodes = mountNewLoopElement(arrayElement);

            parentElement.append(...childNodes);
        });
    };

    if (arrayReference) {
        $VindEngine.reactiveArraysDOMElements[arrayReference].push({
            HTMLCollection: parentElement.children,
            parentLoopElement: parentElement,
            mountNewLoopElement,
        });
    }

    $VindEngine.queueReactiveEffect({ effect });
};
