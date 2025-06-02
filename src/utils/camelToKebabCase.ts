export const camelToKebabCase = (string: string) => {
    if (!string) {
        return "";
    }

    return string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};

// funkcja zmieniajaca camel case na kebab case
// uzywane w przypadku zamiany nazwy propsow z kluczy obiektu Props
// z komponentu na kebap case uzyty w atrybutach HTML