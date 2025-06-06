import { evaluateJSExpression } from "../../../utils/evaluateJSExpression.js";

export const bindIfDirective = (element: HTMLElement, componentContext: {}) => {
    const value = element.getAttribute(":if");

    $VindEngine.queueReactiveEffect({
        effect: () => {
            const display = evaluateJSExpression(componentContext, value);

            element.style.display = display ? "initial" : "none";
        },
    });
};
