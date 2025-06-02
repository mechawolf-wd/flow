export const replaceInterpolationMarkers = (template: string) => {
    if (!template) {
        return "";
    }

    return template.replace(
        /{{\s*(.+?)\s*}}/g,
        "<vind-expression>$1</vind-expression>"
    );
};

// sluzy do zamiany interpolacji reaktywnych {{ }} markerów na tagi
// widoczne dla kompilatora HTML