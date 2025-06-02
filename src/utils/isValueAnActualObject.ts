export const isValueAnActualObject = (value: any) => {
    return (
        value !== null &&
        Object.prototype.toString.call(value) === "[object Object]"
    );
};

// funkcja sprawdzajaca czy wartosc jest obiektem rozszerzalnym w formacie "{}"