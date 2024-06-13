export const replaceInterpolationMarkers = (template: string) => {
    if (!template) {
        return "";
    }

    return template.replace(
        /{{\s*(.+?)\s*}}/g,
        "<vind-expression>$1</vind-expression>"
    );
};
