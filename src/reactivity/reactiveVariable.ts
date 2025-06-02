// @ts-nocheck
import { isPrimitive } from "../utils/isPrimitive";
import {
    REACTIVE_VARIABLE_REF_CONFIG,
    REACTIVE_VARIABLE_ARRAY_CONFIG,
} from "../configuration/constants";
import { generateNewReference } from "../utils/generateNewReference";
import { getReactiveVariableType } from "../utils/getReactiveVariableType";
import { isValueAnActualObject } from "../utils/isValueAnActualObject";
import { ARRAY_MUTATING_METHODS } from "../configuration/constants";

const runComputedDependencesExtractor = (
    computedCallback: () => void,
    targetReactiveVariableReference: string
) => {
    $VindEngine.computedDependencyExtractorRunning = true;
    $VindEngine.currentReactiveVariableReference =
        targetReactiveVariableReference;

    computedCallback();

    $VindEngine.computedDependencyExtractorRunning = false;
    $VindEngine.currentReactiveVariableReference = "";

    $VindEngine.extractedComputedDependencies.clear();
};

// Converts target value into a deeply reactive object if necessary.
const getReactiveVariable = (value, configuration) => {
    // If the value is not in a form of "{}" object the value will be returned
    // without any further recursive nesting of reactive values.
    if (!isValueAnActualObject(value)) {
        return value;
    }

    const outputReactiveObject = {};

    for (const key in value) {
        const isValueAnArray = Array.isArray(value[key]);

        if (isValueAnArray) {
            outputReactiveObject[key] = reactiveArray(
                value[key],
                REACTIVE_VARIABLE_ARRAY_CONFIG
            );

            continue;
        }

        const isValueAnObject = isValueAnActualObject(value[key]);

        if (isValueAnObject) {
            outputReactiveObject[key] = reactiveVariable(value[key], configuration);

            continue;
        }

        // If the property's value is not in a form of "{}" object or an array there won't be
        // any further action taken.
        outputReactiveObject[key] = value[key];
    }

    return outputReactiveObject;
};

interface ReactiveArrayDOMElement {
    HTMLCollection: HTMLCollection;
    parentLoopElement: HTMLElement & { $VindNode };
    mountNewLoopElement: (newArrayElement) => any;
}

interface ReactiveArrayElement {
    element;
    index: { value: number };
}

type WatchSignal = (newValue, previousValue) => void;

const getCloneForChildrenOfReactiveArray = () => {
    const clone = structuredClone(REACTIVE_VARIABLE_REF_CONFIG);

    clone.isChildOfReactiveArray = true;

    return clone;
};

// Reactive arrays do work (somehow).
// However, they need more debugging since there are plenty of edge cases
// regarding reactivity of nested values.
// Eg. pushing a new value into an array may become buggy and
// won't respond to reactive updates.
export const reactiveArray = (value, configuration = {}) => {
    value.forEach((element, index: number) => {
        value[index] = reactiveVariable(
            element,
            getCloneForChildrenOfReactiveArray()
        );
    });

    let type = configuration.variableType || "UNSPECIFIED";

    const arrayReference = generateNewReference(type);

    // The array proxy is strongly linked to its DOM representation.
    // It is hard to keep track of both sources of truth at the same time.
    $VindEngine.reactiveArraysDOMElements[arrayReference] = [];

    const reactiveArrayProxy = new Proxy(value, {
        get(target, property, receiver) {
            const isPropertyAMutativeMethod =
                typeof target[property] === "function" &&
                ARRAY_MUTATING_METHODS.includes(String(property));

            if (isPropertyAMutativeMethod) {
                return (...functionArguments) => {
                    const hasReference =
                        $VindEngine.reactiveArraysDOMElements[arrayReference];

                    if (
                        !hasReference &&
                        (property === "push" || property === "unshift")
                    ) {
                        const reactiveElement = reactiveVariable(
                            target,
                            getCloneForChildrenOfReactiveArray()
                        );

                        return Array.prototype[property].apply(
                            reactiveElement,
                            functionArguments
                        );
                    }

                    if (property === "pop") {
                        const result = target.pop();

                        $VindEngine.reactiveArraysDOMElements[arrayReference].forEach(
                            ({ HTMLCollection }: ReactiveArrayDOMElement) => {
                                if (HTMLCollection.length === 0) return;

                                HTMLCollection[HTMLCollection.length - 1].remove();
                            }
                        );

                        return result;
                    }

                    if (property === "shift") {
                        const result = target.shift();

                        target.$VindReactiveArray.forEach(
                            ({ element, index }: ReactiveArrayElement) => {
                                index.value = target.indexOf(element);
                            }
                        );

                        $VindEngine.reactiveArraysDOMElements[arrayReference].forEach(
                            ({ HTMLCollection }: ReactiveArrayDOMElement) => {
                                if (HTMLCollection.length === 0) return;

                                HTMLCollection[0].remove();
                            }
                        );

                        return result;
                    }

                    if (property === "splice") {
                        const result = target.splice(...functionArguments);

                        target.$VindReactiveArray.forEach(
                            ({ element, index }: ReactiveArrayElement) => {
                                index.value = target.indexOf(element);
                            }
                        );

                        $VindEngine.reactiveArraysDOMElements[arrayReference].forEach(
                            ({ HTMLCollection }: ReactiveArrayDOMElement) => {
                                const [start, deleteCount] = functionArguments;

                                for (let i = start; i < start + deleteCount; i++) {
                                    HTMLCollection[i].remove();
                                }
                            }
                        );

                        return result;
                    }

                    if (property === "reverse") {
                        const result = target.reverse();

                        target.$VindReactiveArray.forEach(
                            ({ element, index }: ReactiveArrayElement) => {
                                index.value = target.indexOf(element);
                            }
                        );

                        $VindEngine.reactiveArraysDOMElements[arrayReference].forEach(
                            ({
                                HTMLCollection,
                                parentLoopElement,
                            }: ReactiveArrayDOMElement) => {
                                if (parentLoopElement.childNodes.length === 0) return;

                                for (let i = HTMLCollection.length - 1; i >= 0; i--) {
                                    parentLoopElement.append(HTMLCollection[i]);
                                }
                            }
                        );

                        return result;
                    }

                    if (property === "sort") {
                        let result;

                        $VindEngine.reactiveArraysDOMElements[arrayReference].forEach(
                            ({
                                HTMLCollection,
                                parentLoopElement,
                            }: ReactiveArrayDOMElement) => {
                                parentLoopElement.$VindNode = {};
                                parentLoopElement.$VindNode.correspondingMap = new Map();

                                Array.from(HTMLCollection).forEach((element, index) => {
                                    parentLoopElement.$VindNode.correspondingMap.set(
                                        target[index],
                                        element
                                    );
                                });
                            }
                        );

                        const [sortingFunction = () => undefined] = functionArguments;

                        result = target.sort(sortingFunction);

                        target.$VindReactiveArray.forEach(
                            ({ element, index }: ReactiveArrayElement) => {
                                index.value = target.indexOf(element);
                            }
                        );

                        $VindEngine.reactiveArraysDOMElements[arrayReference].forEach(
                            ({
                                parentLoopElement,
                            }: {
                                parentLoopElement: HTMLElement & { $VindNode };
                            }) => {
                                const sortedOrderPlaceholder = document.createElement("div");

                                target.forEach((originTargetElement) => {
                                    sortedOrderPlaceholder.append(
                                        parentLoopElement.$VindNode.correspondingMap.get(
                                            originTargetElement
                                        )
                                    );
                                });

                                parentLoopElement.append(...sortedOrderPlaceholder.childNodes);
                            }
                        );

                        return result;
                    }

                    if (property === "push") {
                        const reactiveElement = reactiveVariable(
                            functionArguments[0],
                            getCloneForChildrenOfReactiveArray()
                        );

                        const result = target.push(reactiveElement);

                        target.$VindReactiveArray.push({
                            element: reactiveElement,
                            index: reactiveVariable(
                                target.length - 1,
                                getCloneForChildrenOfReactiveArray()
                            ),
                        });

                        $VindEngine.reactiveArraysDOMElements[arrayReference].forEach(
                            ({
                                parentLoopElement,
                                mountNewLoopElement,
                            }: ReactiveArrayDOMElement) => {
                                const childNodes = mountNewLoopElement(reactiveElement);

                                parentLoopElement.append(...childNodes);
                            }
                        );

                        return result;
                    }

                    if (property === "unshift") {
                        const reactiveElement = reactiveVariable(
                            functionArguments[0],
                            getCloneForChildrenOfReactiveArray()
                        );

                        const result = target.unshift(reactiveElement);

                        target.$VindReactiveArray.unshift({
                            element: reactiveElement,
                            index: reactiveVariable(0, getCloneForChildrenOfReactiveArray()),
                        });

                        target.$VindReactiveArray.forEach(
                            ({ element, index }: ReactiveArrayElement) => {
                                index.value = target.indexOf(element);
                            }
                        );

                        $VindEngine.reactiveArraysDOMElements[arrayReference].forEach(
                            ({
                                parentLoopElement,
                                mountNewLoopElement,
                            }: ReactiveArrayDOMElement) => {
                                const childNodes = mountNewLoopElement(reactiveElement);

                                parentLoopElement.prepend(...childNodes);
                            }
                        );

                        return result;
                    }
                };
            }

            return Reflect.get(target, property, receiver);
        },
        set(target, property, newValue, receiver) {
            if (property === "value") {
                while (receiver.length) {
                    receiver.pop();
                }

                newValue.forEach((newArrayElement) => {
                    receiver.push(newArrayElement, configuration);
                });
            }

            target[property] = newValue;

            return true;
        },
    });

    $VindEngine.reactiveVariables[arrayReference] = {
        variableProxy: reactiveArrayProxy,
        configuration,
    };

    reactiveArrayProxy.$VindReactiveArray = reactiveArrayProxy.map(
        (element, index: number) => {
            return {
                element,
                index: reactiveVariable(index, getCloneForChildrenOfReactiveArray()),
            };
        }
    );

    return reactiveArrayProxy;
};

// This function serves for all types of reactive variables but "REACTIVE-ARRAY".
export const reactiveVariable = (definedValue, configuration = {}) => {
    let type = configuration.variableType || "UNSPECIFIED";

    const newVariableReference = generateNewReference(type);

    $VindEngine.watchCallbacks[newVariableReference] = [];

    // If the variable is of type "COMPUTED" the dependency extractor will be run.
    if (configuration.variableType === "COMPUTED") {
        runComputedDependencesExtractor(definedValue, newVariableReference);
    }

    const isValueARegularObject = isValueAnActualObject(definedValue);
    const isValuePrimitive = isPrimitive(definedValue);

    const variableProxy = new Proxy(
        {
            // If the value is a regular object, the value will be wrapped in a reactive variable.
            ...(isValueARegularObject
                ? getReactiveVariable(definedValue, configuration)
                : { value: definedValue }),
        },
        {
            get(target, property) {
                // If the computed dependency extractor is running, the dependencies will be extracted.
                if ($VindEngine.computedDependencyExtractorRunning) {
                    $VindEngine.extractedComputedDependencies.add(newVariableReference);

                    configuration.influences.push(
                        $VindEngine.currentReactiveVariableReference
                    );

                    return;
                }

                if ($VindEngine.dependencyExtractorRunning) {
                    $VindEngine.extractedDependencies.add(newVariableReference);
                }

                const propertyValue = target[property];

                // In case of the reactive variable is of type "COMPUTED", the value will be computed
                // by running the function.
                return typeof propertyValue === "function"
                    ? propertyValue()
                    : propertyValue;
            },

            set(target, property, newValue) {
                const previousValue = target[property];

                if (property === "length") {
                    // Update the array's length via Reflect.
                    const result = Reflect.set(target, property, newValue, receiver);

                    // If the length changes, trigger any watchers.
                    if (previousValue !== newValue) {
                        $VindEngine.watchCallbacks[newVariableReference]?.forEach(
                            (callback) => {
                                callback(newValue, previousValue);
                            }
                        );
                    }
                    return result;
                }

                // If the value is a primitive and the new value is the same as the previous value, the
                // value will not be updated in order to prevent unnecessary reactive updates.
                if (isValuePrimitive && newValue === previousValue) {
                    return true;
                }

                target[property] = newValue;

                const watchCallbacks = $VindEngine.watchCallbacks[newVariableReference];

                // If there are any watch callbacks linked to the reactive variable that is being set, they will be run.
                if (watchCallbacks.length > 0) {
                    watchCallbacks.forEach((watchSignal: WatchSignal) =>
                        watchSignal(newValue, previousValue)
                    );
                }

                // Running all the reactive effects that are linked to the reactive variable that is being set.
                const influencedReferences = configuration.influences;

                influencedReferences.forEach((influencedReference: string) => {
                    const computedWatchCallbacks =
                        $VindEngine.watchCallbacks[influencedReference];

                    const computedReactiveReference =
                        $VindEngine.reactiveVariables[influencedReference].variableProxy;

                    computedWatchCallbacks.forEach((watchSignal: WatchSignal) =>
                        // TODO: The previous value is the same as the new value, this is not correct.
                        watchSignal(
                            computedReactiveReference.value,
                            computedReactiveReference.value
                        )
                    );
                });

                // Starting a recursive chain of reactive updates.
                $VindEngine.runReactiveEffects({
                    reference: newVariableReference,
                    configuration,
                });

                return true;
            },
        }
    );

    // Upon defining a new reactive variable, the variable will be stored in the reactive variables
    // global object in the Vind engine.
    $VindEngine.reactiveVariables[newVariableReference] = {
        variableProxy,
        configuration,
    };

    return variableProxy;
};
