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

    const { cardTitle } = useStore('cardStore')

    setTimeout(() => {
        test.a.b.c.d.hello = 'Change me!'
    }, 2000);

    return { test, cardTitle }
};

export const Template = /* HTML */ `
    <div style="display: grid">
        <input type="text" :value="test.hello" />
        {{ test.a.b.c.d.hello }}
        {{ cardTitle.value }}
    </div>
`;

export const Style = /* CSS */ `

`;
