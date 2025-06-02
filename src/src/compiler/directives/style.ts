// @ts-nocheck
import { evaluateJSExpression } from "../../../utils/evaluateJSExpression.js";

const bindStyleObject = (element: HTMLElement = {}, styleExpression = {}) => {
    Object.entries(styleExpression).forEach(([key, value]) => {
        $VindEngine.queueReactiveEffect({
            effect: () => {
                let computedPopertyValue = "";

                if (typeof value === "function") {
                    computedPopertyValue = value();
                }

                element.style[key] = String(computedPopertyValue);
            },
        });
    });

    return;
};

export const bindStyleDirective = (
    element: HTMLElement,
    componentContext: {}
) => {
    const styleAttributeValue = element.getAttribute(":style");

    const styleExpression = evaluateJSExpression(
        componentContext,
        styleAttributeValue
    );

    if (!Array.isArray(styleExpression) && typeof styleExpression === "object") {
        bindStyleObject(element, styleExpression);

        return;
    }

    if (Array.isArray(styleExpression)) {
        styleExpression.forEach((classItem) => {
            bindStyleObject(element, classItem);
        });

        return;
    }
};
