// here's how its done in petite vue

const evalCache: Record<string, Function> = Object.create(null)

export const evaluate = (scope: any, exp: string, el?: Node) =>
    execute(scope, `return(${exp})`, el)

export const execute = (scope: any, exp: string, el?: Node) => {
    const fn = evalCache[exp] || (evalCache[exp] = toFunction(exp))
    try {
        return fn(scope, el)
    } catch (e) {
        if (import.meta.env.DEV) {
            console.warn(`Error when evaluating expression "${exp}":`)
        }
        console.error(e)
    }
}