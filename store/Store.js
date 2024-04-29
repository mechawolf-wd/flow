export const cardStore = ({ ref }) => {
    const cardTitle = ref("Bound Card title.");
    const cardDescription = ref("Card description.");

    return {
        cardTitle,
        cardDescription,
    };
};

export const dateStore = ({ ref }) => {
    const currentDate = ref(new Date());

    setInterval(() => {
        currentDate.value = new Date();
    }, 1000);

    return {
        currentDate,
    };
};
