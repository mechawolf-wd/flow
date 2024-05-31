export const Props = ['reactive-prop', 'something-else']

export const TestingReactivity = () => {
    const test = ref({
        hello: 'Hello World!',
        nested: {
            hello: 'Nested Hello World!'
        },
        a: {
            b: {
                c: {
                    d: {
                        hello: 'Deeply nested Hello World!',
                    }
                }
            }
        }
    })

    watch(() => props.reactiveProp.value, (newValue, oldValue) => {
        console.log(newValue, oldValue)
    })

    const { cardTitle } = stores.cardStore

    cardTitle.value = 'random title'

    setTimeout(() => {
        test.a.b.c.d.hello = 'Change me!'
    }, 2000);

    setTimeout(() => {
        test.nested.hello = "I got changed!"
    }, 1000);

    return { test, cardTitle }
};

export const Template = /* HTML */ `
    <div style="display: grid">
        <input type="text" :value="test.a.b.c.d.hello" />
        {{ test.a.b.c.d.hello }}
        {{ test.nested.hello }}
        {{ reactiveProp.value }}
    </div>
`;

export const Style = /* CSS */ `

`;
