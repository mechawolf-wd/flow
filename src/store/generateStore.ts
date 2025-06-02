// @ts-nocheck
import {
    reactiveVariable,
    reactiveArray,
} from "../reactivity/reactiveVariable";
import {
    REACTIVE_VARIABLE_REF_CONFIG,
    REACTIVE_VARIABLE_COMPUTED_CONFIG,
    REACTIVE_VARIABLE_ARRAY_CONFIG,
} from "../configuration/constants";

export function generateStore(
    name: string,
    storeFunction: (storeObject: object) => void
) {
    return () => {
        const store = storeFunction({
            ref: (value: any) => {
                if (Array.isArray(value)) {
                    const outputReactiveArray = reactiveArray(
                        value,
                        structuredClone(REACTIVE_VARIABLE_ARRAY_CONFIG)
                    );

                    return outputReactiveArray;
                }

                return reactiveVariable(
                    value,
                    structuredClone(REACTIVE_VARIABLE_REF_CONFIG)
                );
            },
            computed: (computedCallback: () => void) => {
                return reactiveVariable(
                    computedCallback,
                    structuredClone(REACTIVE_VARIABLE_COMPUTED_CONFIG)
                );
            },
            watch: (
                source: any,
                callback: (newValue: any, previousValue: any) => void,
                watchConfiguration: { [key: string]: any } = {}
            ) => {
                const isSourceAFunction = typeof source === "function";
                const isSourceAnArray = Array.isArray(source);

                const { immediate = false } = watchConfiguration;

                const setWatchCallback = (sourceExtractorCallback: () => any) => {
                    $VindEngine.dependencyExtractorRunning = true;

                    const callbackValue = sourceExtractorCallback();

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
        });

        $VindEngine.stores[name] = store;
    };
}
