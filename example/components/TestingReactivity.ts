export const Props = {
    reactiveProp: {
        type: String,
        default: 'default asdfohasf',
        required: false
    }
}

export const TestingReactivity = () => {
    const { cardTitle } = $stores.cardStore

    const test = ref({
        hello: 'Hello World!',
        a: {
            b: {
                c: {
                    d: {
                        e: {
                            f: {
                                // TODO: weird bug, model updating the wron way
                                nested: 'Nested value',
                            }
                        }
                    }
                }
            }
        },
        b: {
            nested: () => cardTitle.value
        }
    })

    // @ts-ignore
    watch(() => $props.reactiveProp.value, (newValue: string, oldValue: string) => {
        // console.log(newValue, oldValue)
    })

    return { test, cardTitle }
};

export const Template = /* HTML */ `
    <div class="reactivity-container">
        <p class="reactivity-text">{{ test.a.b.c.d.e.f.nested }}</p>
        <pre class="reactivity-pre">{{ $stringify(test) }}</pre>
        <input type="text" :model="test.a.b.c.d.e.f.nested" class="" />
    </div>
`;

export const Style = /* CSS */ `
    .reactivity-container {
        display: grid;
        gap: 1rem;
        background: #f8f9fa; /* Light background */
        color: #343a40; /* Dark text */
        padding: 1rem;
        border: 1px solid #dee2e6; /* Light grey border */
        border-radius: 0.25rem; /* Rounded corners */
        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); /* Soft shadow */
    }

    .reactivity-input {
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.25rem;
        border: 1px solid #ced4da; /* Standard input border */
        margin-top: 0.5rem; /* Margin above the input */
        background: #ffffff; /* White background */
        color: #495057; /* Slightly dark grey for text */
        box-sizing: border-box; /* Includes padding and border in the element's total width and height */
        transition: border-color 0.3s ease, box-shadow 0.3s ease; /* Smooth transition */
    }

    .reactivity-input:focus {
        border-color: #42b983; /* Vue.js green */
        box-shadow: 0 0 5px rgba(66, 185, 131, 0.5);
        outline: none;
    }

    .reactivity-text {
        font-size: 1rem;
        color: #343a40; /* Dark text color */
    }

    .reactivity-pre {
        background: #e9ecef; /* Light grey background */
        padding: 0.75rem;
        border-radius: 0.25rem;
        white-space: pre-wrap; /* Wraps the text within the container */
        word-break: break-all; /* Breaks long words */
        font-size: 0.875rem; /* Slightly smaller font size */
        color: #212529; /* Darker text for readability */
    }
`;
