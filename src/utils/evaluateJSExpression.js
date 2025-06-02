const prohibitedKeywordsRE = new RegExp(
    "\\b" +
    (
        "do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const," +
        "super,throw,while,yield,delete,export,import,return,switch,default," +
        "extends,finally,continue,debugger,function,arguments"
    )
        .split(",")
        .join("\\b|\\b") +
    "\\b"
);

const stripStringRE =
    /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

function checkExpression(functionParameters, expression) {
    try {
        return new Function(...functionParameters, `return ${expression}`);
    } catch (error) {
        const keywordMatch = expression
            .replace(stripStringRE, "")
            .match(prohibitedKeywordsRE);
        if (keywordMatch) {
            console.warn(
                `Invalid expression: keyword "${keywordMatch[0]}" is prohibited in\n\n`,
                expression
            );
        } else {
            console.warn(`Invalid expression: ${error.message} in\n\n`, expression);
        }
    }
}

export const evaluateJSExpression = (context, expression) => {
    try {
        const setupKeys = Object.keys(context);

        const expressionEvaluator = checkExpression(setupKeys, expression);

        const setupValues = Object.values(context);

        return expressionEvaluator(...setupValues);
    } catch (error) {
        console.warn(error);

        return "";
    }
};

// kompilator kodu javascript uzywany w przypadku ewaluacji wartosci z tagow {{ }} (<vind-expression>)
// lub wartosci atrybutow (w dev-time).
