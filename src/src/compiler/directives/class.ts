import { evaluateJSExpression } from "../../../utils/evaluateJSExpression.js";

const bindClassObject = (element: HTMLElement, classExpression: {}) => {
    Object.entries(classExpression).forEach(([key, value]) => {
        $VindEngine.queueReactiveEffect({
            effect: () => {
                let condition = false;

                if (typeof value === "function") {
                    condition = value();
                }

                element.classList.toggle(key, condition);
            },
        });
    });

    return;
};

export const bindClassDirective = (
    element: HTMLElement,
    componentContext: {}
) => {
    const classAttributeValue = element.getAttribute(":class");

    const classExpression = evaluateJSExpression(
        componentContext,
        classAttributeValue
    );

    if (!Array.isArray(classExpression) && typeof classExpression === "object") {
        bindClassObject(element, classExpression);

        return;
    }

    if (Array.isArray(classExpression)) {
        classExpression.forEach((classItem) => {
            if (typeof classItem === "object") {
                bindClassObject(element, classItem);
            } else {
                element.classList.add(String(classItem));
            }
        });

        return;
    }

    element.classList.add(String(classExpression));
};
