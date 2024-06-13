import { isPrimitive } from "../utils/isPrimitive";
import {
    REACTIVE_VARIABLE_REF_CONFIG,
    REACTIVE_VARIABLE_ARRAY_CONFIG,
} from "../configuration/configuration";

export function getRandomNumberString(digits: number) {
    if (window.crypto && window.crypto.getRandomValues) {
        const array = new Uint8Array(digits);
        window.crypto.getRandomValues(array);
        return Array.from(array, (num) => (num % 10).toString()).join("");
    } else {
        const min = Math.pow(10, digits - 1);
        const number = Math.trunc(Math.random() * 9 * min) + min;
        return number.toString();
    }
}

export function generateNewReference(type: string) {
    const part1 = getRandomNumberString(8);

    return `VIND-RV-${type}-${part1}`;
}

const runComputedDependencesExtractor = (
    computedCallback: () => void,
    variableReference: string
) => {
    $VindEngine.computedDependencyExtractorRunning = true;
    $VindEngine.currentReactiveVariableReference = variableReference;

    computedCallback();

    $VindEngine.computedDependencyExtractorRunning = false;
    $VindEngine.currentReactiveVariableReference = "";
    $VindEngine.extractedComputedDependencies.clear();
};

const getReactiveVariableType = (configuration: { [key: string]: any }) => {
    let type = "";

    if (configuration.isRef) {
        type = "REF";
    } else if (configuration.isComputed) {
        type = "COMPUTED";
    } else if (configuration.isProp) {
        type = "PROP";
    } else if (configuration.isReactiveArray) {
        type = "REACTIVE-ARRAY";
    } else {
        type = "UNSPECIFIED";
    }

    return type;
};

const isValueAnActualObject = (value: any) => {
    return (
        value !== null &&
        Object.prototype.toString.call(value) === "[object Object]"
    );
};

const getReactiveVariable = (
    value: any,
    configuration: { [key: string]: any }
) => {
    if (!isValueAnActualObject(value)) return value;

    const outputReactiveObject: { [key: string]: any } = {};

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

        outputReactiveObject[key] = value[key];
    }

    return outputReactiveObject;
};

const arrayMutatingMethods = [
    "push",
    "unshift",
    "pop",
    "shift",
    "splice",
    "sort",
    "reverse",
];

interface ReactiveArrayDOMElement {
    HTMLCollection: HTMLCollection;
    parentLoopElement: HTMLElement & { $VindNode: any };
    mountNewLoopElement: (newArrayElement: any) => any;
}

interface ReactiveArrayElement {
    element: any;
    index: { value: number };
}

type WatchSignal = (newValue: any, previousValue: any) => void

export const reactiveArray = (
    value: any,
    configuration: { [key: string]: any } = {}
) => {
    configuration.isReactiveVariable = true;

    value.forEach((element: any, index: number) => {
        value[index] = reactiveVariable(
            element,
            structuredClone(REACTIVE_VARIABLE_REF_CONFIG)
        );
    });

    let type = getReactiveVariableType(configuration);

    const arrayReference = generateNewReference(type);

    $VindEngine.reactiveArraysDOMElements[arrayReference] = [];

    const reactiveArrayProxy = new Proxy(value, {
        get(target, property, receiver) {
            const isPropertyAMutativeMethod =
                typeof target[property] === "function" &&
                arrayMutatingMethods.includes(String(property));

            if (isPropertyAMutativeMethod) {
                return (...functionArguments: any[]) => {
                    const hasReference =
                        $VindEngine.reactiveArraysDOMElements[arrayReference];

                    if (
                        !hasReference &&
                        (property === "push" || property === "unshift")
                    ) {
                        const reactiveElement = reactiveVariable(
                            target,
                            structuredClone(REACTIVE_VARIABLE_REF_CONFIG)
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
                            ({
                                element,
                                index,
                            }: ReactiveArrayElement) => {
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
                            ({
                                element,
                                index,
                            }: ReactiveArrayElement) => {
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

                        target.$VindReactiveArray.forEach(({ element, index }: ReactiveArrayElement) => {
                            index.value = target.indexOf(element);
                        });

                        $VindEngine.reactiveArraysDOMElements[arrayReference].forEach(
                            ({
                                parentLoopElement,
                            }: {
                                parentLoopElement: HTMLElement & { $VindNode: any };
                            }) => {
                                const sortedOrderPlaceholder = document.createElement("div");

                                target.forEach((originTargetElement: any) => {
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
                            structuredClone(REACTIVE_VARIABLE_REF_CONFIG)
                        );

                        const result = target.push(reactiveElement);

                        target.$VindReactiveArray.push({
                            element: reactiveElement,
                            index: reactiveVariable(
                                target.length - 1,
                                structuredClone(REACTIVE_VARIABLE_REF_CONFIG)
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
                            structuredClone(REACTIVE_VARIABLE_REF_CONFIG)
                        );

                        const result = target.unshift(reactiveElement);

                        target.$VindReactiveArray.unshift({
                            element: reactiveElement,
                            index: reactiveVariable(
                                0,
                                structuredClone(REACTIVE_VARIABLE_REF_CONFIG)
                            ),
                        });

                        target.$VindReactiveArray.forEach(({ element, index }: ReactiveArrayElement) => {
                            index.value = target.indexOf(element);
                        });

                        $VindEngine.reactiveArraysDOMElements[arrayReference].forEach(
                            ({ parentLoopElement, mountNewLoopElement }: ReactiveArrayDOMElement) => {
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

                newValue.forEach((element: any) => {
                    receiver.push(element);
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
        (element: any, index: number) => {
            return {
                element,
                index: reactiveVariable(
                    index,
                    structuredClone(REACTIVE_VARIABLE_REF_CONFIG)
                ),
            };
        }
    );

    return reactiveArrayProxy;
};

export const reactiveVariable = (value: any, configuration: { [key: string]: any } = {}) => {
    configuration.isReactiveVariable = true;

    let type = getReactiveVariableType(configuration);

    const variableReference = generateNewReference(type);

    $VindEngine.watchCallbacks[variableReference] = [];

    if (configuration.isComputed) {
        runComputedDependencesExtractor(value, variableReference);
    }

    configuration.isValueAnActualObject = isValueAnActualObject(value);
    configuration.isValuePrimitive = isPrimitive(value);

    const variableProxy = new Proxy(
        {
            ...(configuration.isValueAnActualObject
                ? getReactiveVariable(value, configuration)
                : { value }),
        },
        {
            get(target, property) {
                if ($VindEngine.computedDependencyExtractorRunning) {
                    $VindEngine.extractedComputedDependencies.add(variableReference);
                    configuration.influences.push(
                        $VindEngine.currentReactiveVariableReference
                    );

                    return;
                }

                if ($VindEngine.dependencyExtractorRunning) {
                    $VindEngine.extractedDependencies.add(variableReference);
                }

                const propertyValue = target[property];

                return typeof propertyValue === "function"
                    ? propertyValue()
                    : propertyValue;
            },

            set(target, property, newValue) {
                const previousValue = target[property];

                if (configuration.isValuePrimitive && newValue === previousValue) {
                    return true;
                }

                target[property] = newValue;

                const watchCallbacks = $VindEngine.watchCallbacks[variableReference];

                if (watchCallbacks.length > 0) {
                    watchCallbacks.forEach((watchSignal: WatchSignal) =>
                        watchSignal(newValue, previousValue)
                    );
                }

                const influencedReferences = configuration.influences;

                influencedReferences.forEach((influencedReference: string) => {
                    const computedWatchCallbacks =
                        $VindEngine.watchCallbacks[influencedReference];

                    const computedReactiveReference =
                        $VindEngine.reactiveVariables[influencedReference].variableProxy;

                    computedWatchCallbacks.forEach((watchSignal: WatchSignal) =>
                        watchSignal(
                            computedReactiveReference.value,
                            computedReactiveReference.value
                        )
                    );
                });

                $VindEngine.runReactiveEffects({
                    reference: variableReference,
                    configuration,
                });

                return true;
            },
        }
    );

    $VindEngine.reactiveVariables[variableReference] = {
        variableProxy,
        configuration,
    };

    return variableProxy;
};
