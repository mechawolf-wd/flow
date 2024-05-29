const moduleURL = './components/NewSyntax.js';

const definitions = [
    "const ref = $FlowEngine.ref\n",
    "const computed = $FlowEngine.computed\n"
]

const appendCode = (code, definitions) => {
    return definitions.join('') + code
}

fetch(moduleURL)
    .then(response => response.text())
    .then(code => {
        code = appendCode(code, definitions)

        const blob = new Blob([code], { type: 'application/javascript' })

        const moduleURL = URL.createObjectURL(blob);

        import(moduleURL).then(module => {
            $FlowEngine.defineComponentModule(module, 'NewSyntax', true);

            URL.revokeObjectURL(moduleURL);
        })
    })