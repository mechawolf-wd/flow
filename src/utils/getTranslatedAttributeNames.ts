const BINDING_ATTRIBUTE_PREFIX = ":";
const BINDING_EVENT_ATTRIBUTE_PREFIX = "@";

export function getTranslatedAttributeNames(attributes: Attr[]) {
    const outputObject: { [key: string]: Attr[] } = {
        bindingAttributes: [],
        eventAttributes: [],
    };

    if (!attributes) {
        return outputObject;
    }

    const bindingAttributes = attributes.filter(({ name }) => {
        return name.startsWith(BINDING_ATTRIBUTE_PREFIX);
    });

    const eventAttributes = attributes.filter(({ name }) => {
        return name.startsWith(BINDING_EVENT_ATTRIBUTE_PREFIX);
    });

    outputObject.bindingAttributes = bindingAttributes;
    outputObject.eventAttributes = eventAttributes;

    return outputObject;
}

export function translateBindingAttribute(attribute: string) {
    if (!attribute) {
        return "";
    }

    return attribute.slice(BINDING_ATTRIBUTE_PREFIX.length);
}

export function translateEventAttribute(attribute: string) {
    if (!attribute) {
        return "";
    }

    return attribute.slice(BINDING_EVENT_ATTRIBUTE_PREFIX.length);
}

// funkcje tlumaczace reaktywne atrybuty (prefix: ":") lub listenery @
