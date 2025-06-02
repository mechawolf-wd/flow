// @ts-nocheck
import { templateCompiler } from "./src/compiler/templateCompiler.js";
import { showErrorOverlay } from "./utils/showErrorOverlay.js";
// import { showLoadingOverlay } from "./utils/showLoadingOverlay.js"
import { generateStore } from "./store/generateStore";

const callWithErrorOverlay = (callback) => {
    try {
        callback();
    } catch (error) {
        showErrorOverlay(error);
        throw new Error(error);
    }
};

export const Vind = {
    render(renderingCallback) {
        callWithErrorOverlay(() => {
            renderingCallback(); // do tego ma byc opis

            $VindEngine.storeGenerationQueue.forEach(
                (storeGeneratorCallback: Function) => storeGeneratorCallback() // do tego ma byc opis
            );

            const { componentFunction: defaultEntryPointComponentFunction } =
                $VindEngine.componentModules["APP"]; // do tego ma byc opis

            templateCompiler( // do tego ma byc opis
                defaultEntryPointComponentFunction,
                document.body,
                undefined,
                "APP",
                { defaultEntryPointId: "#app" }
            );
        });
    },
    defineStores(stores = []) { // do tego ma byc opis
        if (!stores.length) {
            console.warn("Defining stores will not happen.");
        }

        stores.forEach((storeFunction) => {
            $VindEngine.defineStore(storeFunction);
        });
    },
    defineComponents(componentModules = []) { // do tego ma byc opis
        if (!componentModules.length) {
            console.warn("No components were defined.");
        }

        componentModules.forEach((componentModule) => {
            $VindEngine.defineComponentModule(componentModule);
        });
    },
};

window.$VindEngine = (() => {
    const $stringify: typeof JSON.stringify = (
        value: any,
        replacer = null,
        space = 2
    ) => {
        // @ts-expect-error
        return JSON.stringify(value, replacer, space);
    };
    const componentModules = {};

    const templateContentByComponent = {};
    const propertiesByComponent = {};
    const eventsByComponent = {};
    const styleContentByComponent = {};

    const componentsWithStyleMounted = new Set();

    const reactiveEffects = [];
    const lastInfluencedEffectReference = "";

    const reactiveVariables = {};
    const watchCallbacks = {};
    const stores = {};
    const storeGenerationQueue = [];

    const currentReactiveVariableReference = "";

    const computedDependencyExtractorRunning = false;
    const extractedComputedDependencies = new Set();

    const dependencyExtractorRunning = false;
    const extractedDependencies = new Set();

    const reactiveArraysDOMElements = {};

    // Effects
    const queueReactiveEffect = (reactiveEffect) => {
        // Start dependency extraction:
        $VindEngine.dependencyExtractorRunning = true;

        reactiveEffect.references = new Set();

        // Run the effect:
        reactiveEffect.effect();

        // Check if running the effect captured any dependencies:
        if ($VindEngine.extractedDependencies.size > 0) {
            const extractedDependencies = new Set([
                ...$VindEngine.extractedDependencies,
            ]);

            // Assign extracted dependencies to the 'references' property of the reactive effect,
            // which will later trigger the effect's callback if notified.
            reactiveEffect.references = Array.from(extractedDependencies);

            // Clear extracted dependencies:
            $VindEngine.extractedDependencies.clear();
        }

        // Push the new reactive effect into the globally accessible reactiveEffects array:
        reactiveEffects.push(reactiveEffect);

        // Stop dependency extraction:
        $VindEngine.dependencyExtractorRunning = false;
    };

    /**
     * Executes reactive effects based on a given reactive variable reference and its configuration.
     * Prevents infinite loops by tracking the last influenced effect reference.
     *
     * @param {Object} options - The options object containing the reference and configuration.
     * @param {any} options.reference - The reactive variable reference that may trigger effects.
     * @param {Object} options.configuration - Configuration settings for handling influenced references.
     */
    const runReactiveEffects = ({
        reference: reactiveVariableReference,
        configuration,
    }) => {
        // Return if the current reference is already processed to avoid infinite loops.
        if (
            $VindEngine.lastInfluencedEffectReference === reactiveVariableReference
        ) {
            return;
        } else {
            // Set the last influenced effect reference to the current reference.
            $VindEngine.lastInfluencedEffectReference = reactiveVariableReference;
        }

        reactiveEffects.forEach(({ references, effect: highestOrderEffect }) => {
            references.forEach((effectReference) => {
                if (effectReference === reactiveVariableReference) {
                    // Run the highest-order effect function if the reference matches.
                    highestOrderEffect();

                    // Recursively run effects for each influenced reference.
                    configuration.influences.forEach((influencedReference) => {
                        const influencedReferenceConfiguration =
                            reactiveVariables[reactiveVariableReference].configuration || {};

                        runReactiveEffects({
                            reference: influencedReference,
                            configuration: influencedReferenceConfiguration,
                        });
                    });
                }
            });
        });

        // Clear the last influenced effect reference after processing.
        $VindEngine.lastInfluencedEffectReference = "";
    };

    const defineComponentModule = (componentModule, customComponentName = "") => {
        let componentFunction: Function | unknown = Object.values(
            componentModule
        ).find((value) => typeof value === "function");

        const upperCaseComponentName = // @ts-expect-error
            (customComponentName || componentFunction.name).toUpperCase();

        // These keys will always be present in the component module
        // even if they are not defined by the user in a component file.
        $VindEngine.templateContentByComponent[upperCaseComponentName] =
            componentModule["Template"] || ``;

        $VindEngine.styleContentByComponent[upperCaseComponentName] =
            componentModule["Style"] || ``;

        $VindEngine.propertiesByComponent[upperCaseComponentName] =
            componentModule["Props"] || [];

        $VindEngine.eventsByComponent[upperCaseComponentName] =
            componentModule["Emits"] || [];

        // Saving the component module in the global componentModules object.
        // So that it can be accessed later when rendering components when needed.
        componentModules[upperCaseComponentName] = {
            componentFunction,
            componentName: customComponentName || componentFunction.name,
        };
    };

    const defineStore = (storeDefinitionFunction) => {
        const storeName = storeDefinitionFunction.name;

        const storeGenerationFunction = generateStore(
            storeName,
            storeDefinitionFunction
        );

        storeGenerationQueue.push(storeGenerationFunction);
    };

    return {
        $stringify,

        componentModules,
        defineComponentModule,

        templateContentByComponent,
        propertiesByComponent,
        eventsByComponent,
        styleContentByComponent,
        componentsWithStyleMounted,

        reactiveVariables,
        reactiveArraysDOMElements,
        stores,
        storeGenerationQueue,
        defineStore,

        effects: reactiveEffects,
        lastInfluencedEffectReference,
        watchCallbacks,
        queueReactiveEffect,
        runReactiveEffects,

        computedDependencyExtractorRunning,
        extractedComputedDependencies,
        currentReactiveVariableReference,

        dependencyExtractorRunning,
        extractedDependencies,
    };
})();

// * Temporary implemetation of the router aka. "the real router"
const routerStoreDefinition = ({ ref }) => {
    const path = ref("/");

    return {
        path,
    };
};

const routerStoreGenerationFunction = generateStore(
    "routerStore",
    routerStoreDefinition
);

$VindEngine.storeGenerationQueue.push(routerStoreGenerationFunction);
