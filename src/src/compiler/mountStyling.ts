export function mountStyling(styleString: string) {
    if (!styleString) {
        return;
    }

    const style = document.createElement("style");

    style.innerText = styleString;

    document.body.append(style);
}
