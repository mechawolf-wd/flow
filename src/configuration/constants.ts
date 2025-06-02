export const BASE_REACTIVE_VARIABLE_CONFIG = {
    isStored: false,
    influences: [],
};

export const REACTIVE_VARIABLE_REF_CONFIG = {
    ...BASE_REACTIVE_VARIABLE_CONFIG,
    variableType: "REF",
};

export const REACTIVE_VARIABLE_COMPUTED_CONFIG = {
    ...BASE_REACTIVE_VARIABLE_CONFIG,
    variableType: "COMPUTED",
};

export const REACTIVE_VARIABLE_PROP_CONFIG = {
    ...BASE_REACTIVE_VARIABLE_CONFIG,
    variableType: "PROP",
};

export const REACTIVE_VARIABLE_ARRAY_CONFIG = {
    ...BASE_REACTIVE_VARIABLE_CONFIG,
    variableType: "REACTIVE-ARRAY",
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

export const ARRAY_MUTATING_METHODS = [
    "push",
    "unshift",
    "pop",
    "shift",
    "splice",
    "sort",
    "reverse",
];
