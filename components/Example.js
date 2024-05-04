export const Example = ({ useStore, ref, watch }) => {
    const { cardTitle } = useStore('cardStore')

    const counter = ref(1)

    watch(cardTitle, () => {
        counter.value++
    })

    const template = /* HTML */ `<h1>{{ cardTitle }}</h1> <p>{{ counter }}</p>`;

    return { template, cardTitle, counter };
};
