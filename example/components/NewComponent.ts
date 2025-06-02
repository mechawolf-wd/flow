export const NewComponent = () => {
    const data = ref(1);

    const humans = ref([
        {
            name: "Bart",
            age: 38,
            status: "😊",
            cats: [],
        },
        {
            name: "Paul",
            age: 25,
            status: "😊",
            cats: ["Furr", "Puff", "Catto"],
        },
        {
            name: "Anna",
            age: 12,
            status: "😊",
            cats: ["Furr", "Puff", "Catto"],
        },
    ]);

    setTimeout(() => {
        humans[0].name = 'Barteczko'
    }, 3000);

    setTimeout(() => {
        humans.push({
            name: "Anna",
            age: 12,
            status: "😊",
            cats: ["Furr", "Puff", "Catto"],
        })
    }, 2000);

    const condition = computed(() => {
        return humans.length > 3
    })

    return {
        data,
        humans,
        condition
    };
};

export const Template = /* HTML */ `
  <div>
    <div :for="human of humans">
        <Child :example="data.value"></Child>
    </div>
  </div>
`;

export const Style = ``;
