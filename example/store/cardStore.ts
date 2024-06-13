export const cardStore = ({ ref, computed, watch }: any) => {
    const cardTitle = ref("Bound Card title.");
    const cardDescription = ref("Card description.");
    const cards = ref([]);

    const computedCardTitle = computed(() => {
        return cardTitle.value + " - computed";
    });

    // TODO: Computed is called twice.
    watch(
        () => computedCardTitle.value,
        () => {
            console.log("Card title changed.");
        }
    );

    return {
        cardTitle,
        cardDescription,
        cards,
    };
};
