export function getRandomNumberString(digits: number) {
    if (window.crypto && window.crypto.getRandomValues) {
        const array = new Uint8Array(digits);
        window.crypto.getRandomValues(array);
        return Array.from(array, (num) => (num % 10).toString()).join("");
    } else {
        const min = Math.pow(10, digits - 1);
        const number = Math.trunc(Math.random() * 9 * min) + min;
        return number.toString();
    }
}

// generator liczb losowych o okreslonej dlugosci korzystajacy z window.crypto
