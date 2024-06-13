import { templateCompiler } from "./src/compiler/templateCompiler.js";
import { showErrorOverlay } from "./utils/showErrorOverlay.js";
// import { showLoadingOverlay } from "./utils/showLoadingOverlay.js"
import { generateStore } from "./store/generateStore";

const DEFAULT_ENTRY_POINT_COMPONENT_NAME = "App";
const DEFAULT_ENTRY_POINT_ELEMENT_ID = "#app";

// @ts-ignore
const callWithErrorOverlay = (callback) => {
    try {
        callback();
    } catch (error) {
        showErrorOverlay(error);
        // @ts-ignore
        throw new Error(error);
    }
};

export const Vind = {
    // @ts-ignore
    render(renderingCallback) {
        renderingCallback()

        $VindEngine.storeGenerationQueue.forEach(callWithErrorOverlay);

        callWithErrorOverlay(() => {
            const upperCaseEntryPointComponentName = DEFAULT_ENTRY_POINT_COMPONENT_NAME.toUpperCase();

            const { componentFunction: defaultEntryPointComponentFunction } = $VindEngine.componentModules[upperCaseEntryPointComponentName];

            templateCompiler(
                defaultEntryPointComponentFunction,
                document.body,
                undefined,
                DEFAULT_ENTRY_POINT_COMPONENT_NAME,
                { defaultEntryPointId: DEFAULT_ENTRY_POINT_ELEMENT_ID }
            );
        });
    },
    defineComponents(componentModules = []) {
        componentModules.forEach((componentModule) => {
            $VindEngine.defineComponentModule(componentModule);
        });
    },
    defineStores(stores = []) {
        stores.forEach((storeFunction) => {
            $VindEngine.defineStore(storeFunction);
        });
    },
};

window.$VindEngine = (() => {
    // @ts-ignore
    const reactiveEffects = [];
    const lastInfluencedEffectReference = "";

    const reactiveVariables = {};
    const watchCallbacks = {};
    const stores = {};
    // @ts-ignore
    const storeGenerationQueue = [];

    const propertiesByComponent = {};
    const eventsByComponent = {};
    const templateByComponent = {};
    const styleByComponent = {};
    const componentsWithStyleMounted = new Set()

    const componentModules = {};

    const computedDependencyExtractorRunning = false;
    const extractedComputedDependencies = new Set();
    const currentReactiveVariableReference = "";

    const dependencyExtractorRunning = false;
    const extractedDependencies = new Set();

    const reactiveArraysDOMElements = {};

    // Compiler
    const ALLOWED_HTML_TAGS = ["Insert", "Drawer", "vind-expression"];

    // Effects
    const queueReactiveEffect = (
        // @ts-ignore
        newReactiveEffect,
        configuration = { runOnQueue: true, predefinedReferences: [] }
    ) => {
        $VindEngine.dependencyExtractorRunning = true;

        newReactiveEffect.references = new Set();

        const predefinedReferences = configuration.predefinedReferences

        if (configuration.runOnQueue === undefined || configuration.runOnQueue) {
            newReactiveEffect.effect();
        }

        if ($VindEngine.extractedDependencies.size > 0) {
            newReactiveEffect.references = new Set([...$VindEngine.extractedDependencies]);

            $VindEngine.extractedDependencies.clear()
        }

        if (predefinedReferences?.length > 0) {
            predefinedReferences.forEach((reference) => {
                newReactiveEffect.references.add(reference);
            });
        }

        newReactiveEffect.references = Array.from(newReactiveEffect.references);

        reactiveEffects.push(newReactiveEffect);

        $VindEngine.dependencyExtractorRunning = false;
    };

    const runReactiveEffects = ({
        // @ts-ignore
        reference: reactiveVariableReference,
        configuration = {},
    }) => {
        if ($VindEngine.lastInfluencedEffectReference === reactiveVariableReference) return;

        $VindEngine.lastInfluencedEffectReference = reactiveVariableReference;

        // @ts-ignore
        reactiveEffects.forEach(({ references, effect }) => {
            // @ts-ignore
            references.forEach((effectReference) => {
                if (effectReference === reactiveVariableReference) {
                    effect();

                    // @ts-ignore
                    configuration.influences.forEach((influencedReference) => {
                        // @ts-ignore
                        const influencedReferenceConfiguration = reactiveVariables[reactiveVariableReference].configuration || {};

                        runReactiveEffects({
                            reference: influencedReference,
                            configuration: influencedReferenceConfiguration,
                        });
                    });
                }
            });
        }
        );

        $VindEngine.lastInfluencedEffectReference = "";
    };

    // @ts-ignore
    const defineComponentModule = (componentModule, customComponentName = "") => {
        // TODO: This 'find' instruction is not checking whether the found 'function' is an actual component.
        let componentFunction: Function | unknown = Object.values(componentModule).find(
            (value) => typeof value === "function"
        );

        // @ts-ignore
        const upperCaseComponentName = (customComponentName || componentFunction.name).toUpperCase();

        ALLOWED_HTML_TAGS.push((componentFunction as Function).name)

        $VindEngine.templateByComponent[upperCaseComponentName] =
            componentModule["Template"] || ``;

        $VindEngine.styleByComponent[upperCaseComponentName] =
            componentModule["Style"] || ``;

        $VindEngine.propertiesByComponent[upperCaseComponentName] =
            componentModule["Props"] || [];

        $VindEngine.eventsByComponent[upperCaseComponentName] =
            componentModule["Emits"] || [];

        // @ts-ignore
        componentModules[upperCaseComponentName] = {
            componentFunction,
            // @ts-ignore
            componentName: customComponentName || componentFunction.name,
        };
    };

    // @ts-ignore
    const defineStore = (storeFunction) => {
        const storeName = storeFunction.name;

        const storeGenerationFunction = generateStore(storeName, storeFunction);

        storeGenerationQueue.push(storeGenerationFunction);
    };

    return {
        componentModules,
        defineComponentModule,

        templateByComponent,
        propertiesByComponent,
        eventsByComponent,
        styleByComponent,
        componentsWithStyleMounted,

        reactiveVariables,
        reactiveArraysDOMElements,
        stores,
        // @ts-ignore
        storeGenerationQueue,
        defineStore,

        // @ts-ignore
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

        ALLOWED_HTML_TAGS
    };
})();

// * Temporary implemetation of the router aka. "the real router"
// @ts-ignore
const routerStore = ({ ref }) => {
    const path = ref("/");

    return {
        path,
    };
};

const routerStoreGenerationFunction = generateStore("routerStore", routerStore as any);
$VindEngine.storeGenerationQueue.push(routerStoreGenerationFunction);
