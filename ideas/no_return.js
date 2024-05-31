let moduleURL = "./components/NewSyntax.js";

const definitions = [
    "const testing_ref = (value) => value ** 2\n",
    "const testing_computed = (value) => value ** 2\n",
    "\n"
];

const appendCodeWithDefinitions = (code, definitions) => {
    return definitions.join("") + code;
};

export const getComponentModule = async () => {
    let response = await fetch(moduleURL)
    let moduleCode = await response.text()

    moduleCode = appendCodeWithDefinitions(moduleCode, definitions);

    const blob = new Blob([moduleCode], { type: "application/javascript" });

    moduleURL = URL.createObjectURL(blob);

    const outputModule = await import(moduleURL)

    return { outputModule, moduleURL }
};
