declare var $VindEngine: {
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
    storeGenerationQueue,
    defineStore,

    effects,
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

declare var $stores: { [key: string]: { [key: string]: any } };
declare var $router: { [key: string]: { [key: string]: any } };
declare var $props: { [key: string]: { [key: string]: any } };

declare var ref: <T>(value: T) => any;
declare var computed: <T>(callback: () => T) => { value: ReturnType<callback> };
declare var watch: (any, callback) => void;
declare type Store = (destructurableProperties) => { [key: string]: any };
