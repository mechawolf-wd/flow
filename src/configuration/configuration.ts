export const BASE_REACTIVE_VARIABLE_CONFIG = {
    isStored: false,
    influences: [],
};

export const REACTIVE_VARIABLE_REF_CONFIG = {
    ...BASE_REACTIVE_VARIABLE_CONFIG,
    isRef: true,
};

export const REACTIVE_VARIABLE_COMPUTED_CONFIG = {
    ...BASE_REACTIVE_VARIABLE_CONFIG,
    isComputed: true,
};

export const REACTIVE_VARIABLE_PROP_CONFIG = {
    ...BASE_REACTIVE_VARIABLE_CONFIG,
    isProp: true,
};

export const REACTIVE_VARIABLE_ARRAY_CONFIG = {
    ...BASE_REACTIVE_VARIABLE_CONFIG,
    isReactiveArray: true,
};

export const LIFECYCLE_CALLBACKS_TEMPLATE = {
    onMounted: undefined,
    onBeforeMount: undefined,
};

export const STANDARD_INPUT_TYPES = [
    "text",
    "number",
    "password",
    "email",
    "url",
    "tel",
    "date",
    "time",
    "color",
    "range",
];

export const INPUT_TYPES_WITH_CHECKED_ATTRIBUTE = ["checkbox", "radio"];
