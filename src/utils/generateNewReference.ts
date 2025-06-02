import { getRandomNumberString } from "./getRandomNumberString";

export function generateNewReference(type: string) {
    const part1 = getRandomNumberString(8);

    return `VIND-RV-${type}-${part1}`;
}

// generuje nazwe markera dla zmiennych reagujacych
// uzywane do tworzenia polaczen w drzewach reaktywnych
// kazda wartosc reagujaca ma przypisany marker ktorym jest identyfikowana
// korzysta z funkcji getRandomNumberString do stworzenia czego na wzor UUID