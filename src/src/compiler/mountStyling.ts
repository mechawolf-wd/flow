export function mountStyling(styleString: string) {
    if (!styleString) {
        return;
    }

    const style = document.createElement("style");

    style.innerText = styleString;

    document.body.append(style);
}

// tworzy element style na koncu dokumentu korzystajac z zawartosci
// zmiennych const Style = `` pochodzacych z komponentow, uzywany w templateCompilerze
