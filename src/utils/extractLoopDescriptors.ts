export const loopRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;

export function extractLoopDescriptors(expression: string) {
    const outputObject = {
        itemName: "",
        indexName: "",
        arrayExpression: "",
    };

    if (!expression) {
        return outputObject;
    }

    const match = expression.match(loopRE);

    const variablesExpression = match?.[1].trim();
    const arrayExpression = match?.[2].trim();

    let itemName, indexName;

    if (variablesExpression?.includes(",")) {
        [itemName, indexName] = variablesExpression.split(",");

        itemName = itemName.replace("(", "").trim();
        indexName = indexName.replace(")", "").trim();
    } else {
        itemName = variablesExpression;
    }

    outputObject.itemName = itemName || "";
    outputObject.indexName = indexName || "";
    outputObject.arrayExpression = arrayExpression || "";

    return outputObject;
}

// sluzy do wyciagniecia nazwa opisujacych co jest arrayem, co elementem a co indexem
// z wartosci atrybutu :for
