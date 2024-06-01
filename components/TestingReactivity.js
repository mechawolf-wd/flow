export const Props = {
    reactiveProp: {
        type: String,
        default: 'default asdfohasf'
    }
}

export const TestingReactivity = () => {
    const { cardTitle } = stores.cardStore

    const test = ref({
        hello: 'Hello World!',
        a: {
            b: {
                c: {
                    d: {
                        nested: 'Deeply nested Hello World!',
                    }
                }
            }
        },
        b: {
            nested: () => cardTitle.value
        }
    })

    watch(props.reactiveProp, (newValue, oldValue) => {
        console.log(newValue, oldValue)
    })

    setTimeout(() => {
        test.a.b.c.d.nested = 'Change me!'
    }, 2000);

    return { test, cardTitle }
};

export const Template = /* HTML */ `
    <div style="display: grid">
        <input type="text" :value="test.a.b.c.d.nested" />
        <p>{{ test.a.b.c.d.nested }}</p>
        <p>{{ test.b.nested }}</p>
        <p>
            {{ test.c }}
        </p>
        <pre>{{ JSON.stringify(test, null, 2) }}</pre>
    </div>
`;

export const Style = /* CSS */ `

`;
