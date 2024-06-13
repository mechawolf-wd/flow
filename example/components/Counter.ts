export const Props = {
    newId: {
        type: String,
        default: "",
        validator: (newId: string) => {
            return newId.length < 2;
        },
    },
    newCounter: {
        type: String,
        default: "Default value of newCounter.",
    },
};

export const Emits = ["new-emit-attribute"];

export const Template = /* HTML */ `
  <div class="counter">
    <div class="counter-display" :class="dynamicClasses">
      Counter: {{ counter.value }} + {{ exampleNumber.value }} = {{
      computedValue.value }}
    </div>

    <div style="display: flex; justify-content: space-between; gap: 24px;">
      <button class="btn" @click="incrementCounter">Increment ++</button>
      <button class="btn" @click="decrementCounter">Decrement --</button>
      <button
        class="btn special"
        @click="$emit('change-path')"
        :style="dynamicStyling"
      >
        {{ demoText }}
      </button>
    </div>

    <div :for="human of humans">
      <CurrentDate>
        <Insert name="example-drawer">
          <h3>{{ $router.path.value }}</h3>
        </Insert>
      </CurrentDate>
    </div>

    <Drawer name="message"></Drawer>

    <div :for="(human, index) of humans">
      <div class="loop-item">
        <p :class="dynamicClasses">{{ human.name }}</p>
        <p>{{ human.age }}</p>
        <p>{{ human.status }}</p>
        <input type="checkbox" :checked="human.age > 2" />
        <input :model="human.age" />
        {{ index.value }}
      </div>
    </div>
  </div>
`;

export const Counter = () => {
    const counter = ref(1);
    const exampleNumber = ref(100);

    const computedValue = computed(() => {
        return counter.value + exampleNumber.value;
    });

    watch(
        () => computedValue.value,
        (newValue: number, previousValue: number) => {
            // console.log(n, p);
        }
    );

    const dynamicClasses = {
        "color-vind": () => counter.value % 2 === 0,
        "font-bold": () => counter.value % 2 !== 0,
    };

    const dynamicStyling = {
        filter: () => (counter.value % 2 === 0 ? "blur(5px)" : ""),
    };

    const { cardTitle, cards } = $stores.cardStore;

    const incrementCounter = () => {
        counter.value += 1;
    };

    const decrementCounter = () => {
        counter.value -= 1;
    };

    const demoText = "Demo - two way binding.";

    const demoTwoWayBinding = () => {
        cardTitle.value = "Two way binding works!";
    };

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
            card: () => cardTitle.value,
            cats: ["Furr", "Puff", "Catto"],
        },
        {
            name: "Anna",
            age: 12,
            status: "😊",
            cats: ["Furr", "Puff", "Catto"],
        },
    ]);

    const types = ref(["text", "date", "color"]);

    setTimeout(() => {
        humans.unshift({
            name: "Last",
            age: 99,
            status: "😊",
            cats: ["Furr", "Puff", "Catto"],
        });
    }, 500);

    setTimeout(() => {
        humans.sort((a: any, b: any) => a.age - b.age)
    }, 1000);

    return {
        counter,
        exampleNumber,
        computedValue,
        cardTitle,
        humans,
        types,
        demoText,
        cards,
        dynamicClasses,
        dynamicStyling,

        incrementCounter,
        decrementCounter,
        demoTwoWayBinding,
    };
};

export const Style = /* CSS */ `
    .counter {
        background: #f8f9fa; /* Light background */
        color: #343a40; /* Default text color */
        border: 1px solid #dee2e6; /* Light grey border */
        border-radius: 0.25rem; /* Rounded corners */
        padding: 1rem; /* Consistent padding all around */
        margin-bottom: 0.5rem; /* Margin to separate from other elements */
        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); /* Soft shadow */
        display: grid;
        gap: 8px;
        transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth transitions */
    }

    .counter:hover {
        transform: translateY(-0.25rem); /* Slight lift on hover */
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1); /* Enhanced shadow on hover */
    }

    .counter-display,
    .computed-value,
    .loop-item {
        margin-bottom: 0.5rem; /* Space between elements */
    }

    .btn {
        background-color: #42b983; /* Vue.js green */
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
        background-color: #2e8b57; /* Darker green on hover */
    }

    .btn.special {
        background-color: #5cb85c; /* Success green for special button */
    }

    .btn.special:hover {
        background-color: #4cae4c; /* Darker green on hover */
    }

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

    .color-vind {
        color: #42b983;
    }

    .font-bold {
        font-weight: bold;
    }
`;
