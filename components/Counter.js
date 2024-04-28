$Flow.defineComponent('Counter', (props, { ref, computed, emit, useStore, watch, onMounted, onBeforeMount, defineProps }) => {
    let counter = ref(1);
    let exampleNumber = ref(100)

    const computedValue = computed(() => {
        return (counter.value + exampleNumber.value) % 2 === 0 ? 'Even.' : 'Odd.'
    })

    defineProps(['id', 'new-counter'])

    const { cardTitle } = useStore('cardStore');

    const incrementCounter = () => {
        emit('increment', { effect: () => { counter.value += 1 } });
    };

    const decrementCounter = () => {
        emit('decrement', { effect: () => { counter.value -= 1 } });
    };

    watch(counter, (newValue, oldValue) => {
        if (newValue > 25) {
            alert(`Value watched! newValue and oldValue accordingly: ${newValue}, ${oldValue}`)
        }
    })

    // watch(computedValue, (newValue, oldValue) => {
    //     console.log('newValue of computed', newValue, oldValue)
    // })

    onMounted(() => {
        // console.log('onMounted called.')
    })

    onBeforeMount(() => {
        // console.log('onBeforeMount called.')
    })

    const demoTwoWayBinding = () => {
        cardTitle.value = 'Two way binding works!';
    };

    const humans = ref([
        {
            name: 'Bart',
            age: 20
        },
        {
            name: 'Paul',
            age: 25
        }
    ])

    const template = /* HTML */ `
        <div class="counter">
            <div class="counter-display">Counter: {{ counter }} + {{ exampleNumber }} = {{ computedValue }}</div>
            
            <div style="display: flex; justify-content: space-between; gap: 24px;">
                <button class="btn" @click="incrementCounter">Increment ++</button>
                <button class="btn" @click="decrementCounter">Decrement --</button>
                <button class="btn special" @click="demoTwoWayBinding">Demo - two way binding.</button>
            </div>

            <Loop :for="human of humans.map(e => ({ ...e, status: 'Happy 😊' }))">
                <div class="loop-item">
                    {{ human.name }}
                    {{ human.age }}
                    {{ human.status }}
                    <input type="checkbox" :checked="counter % 2 === 0">
                </div>
            </Loop>
        </div>
    `;

    const style = /* CSS */ `
            .counter {
                font-family: 'Arial', sans-serif;
                background: #f8f9fa; /* Light background similar to Bootstrap forms */
                color: #343a40; /* Default Bootstrap text color */
                border: 1px solid #dee2e6; /* Light grey border */
                border-radius: 0.25rem; /* Bootstrap's rounded corners */
                padding: 1rem; /* Consistent padding all around */
                margin-bottom: 0.5rem; /* Margin to separate from other elements */
                box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); /* Bootstrap-like shadow */
                display: grid;
                gap: 8px;
            }
    
            .counter-display,
            .computed-value,
            .loop-item { /* Added loop item class for loop styling */
                margin-bottom: 0.5rem; /* Space between elements */
            }
    
            .btn {
                background-color: #007bff; /* Bootstrap primary button color */
                width: 100%;
                color: white;
                border: none;
                padding: 0.375rem 0.75rem;
                font-size: 1rem;
                border-radius: 0.25rem;
                cursor: pointer;
                transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
                            border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; /* Smooth transition for hover effects */
            }
    
            .btn:hover {
                background-color: #0056b3; /* Darker blue on hover */
            }
    
            .btn.special {
                background-color: #28a745; /* Bootstrap success color for special button */
            }
    
            .btn.special:hover {
                background-color: #1e7e34; /* Darker green on hover */
            }
    
            /* Styling for loop items */
            .loop-item {
                display: flex;
                align-items: center;
                justify-content: space-between; /* Distributes space between name and age */
                padding: 0.375rem 0.75rem; /* Padding similar to buttons */
                border-radius: 0.25rem; /* Rounded corners */
                background: #ffffff; /* White background */
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
                margin-bottom: 0.25rem; /* Space between each loop item */
            }
        `

    return {
        template,
        style,

        counter,
        exampleNumber,
        computedValue,
        cardTitle,
        humans,

        incrementCounter,
        decrementCounter,
        demoTwoWayBinding
    };
});
