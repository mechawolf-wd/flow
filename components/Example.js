export const props = ['drillable-prop']

export const Example = ({ useStore, ref, watch }) => {
    const { cardTitle } = useStore('cardStore')

    const counter = ref(1)

    watch(cardTitle, () => {
        counter.value++
    })

    const template = /* HTML */ `<h1>{{ drillableProp }}</h1>`;

    return { template, cardTitle, counter };
};
