# Flow-JS Framework

<img src="https://img.shields.io/badge/Firefox-FF7139?style=for-the-badge&logo=Firefox-Browser&logoColor=white">
<img src="https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white">
<img src="https://img.shields.io/badge/Safari-000000?style=for-the-badge&logo=Safari&logoColor=white"><br>

## Overview

Flow-JS is an innovative JavaScript framework tailored for building interactive user interfaces with a strong emphasis on reactivity and state management. It simplifies the creation of complex UI components and ensures that your application remains both performant and scalable.

## Features

- 🔄 **Reactive Data Binding**: Changes in your state automatically reflect in your UI without manual intervention.
- 📦 **Efficient State Management**: Comes with built-in methods for managing global and local states, enhancing the predictability of data flow.
- 🔧 **Advanced Directives**: Supports modern directives such as `:for` for loops, `:if` for conditional rendering, and `@event` for handling events.
- 🛠 **Modular Architecture**: Encourages the use of reusable, modular components that can be easily integrated and tested.

## First Line of Necessary TODOs

1. Make props readonly!
2. Implement the `once` directive to bind events or effects that should only execute once.
3. Use reactive props that bind directly to object properties instead of reading from DOM attributes.
4. Cache the values in loop's expressions.
5. Support "immediate" watchers.
6. Fix Checkboxes since once touched, they keep their user-manipulated state.
7. Decide whether to keep `<loop></loop>` tags inside production HTML.
8. Implement `ref=""` directive for referencing DOM elements.
9. Make stores definition order agnostic.
10. Implement the user's ability to watch props.
11. Implement a handling mechanism for components' names casing. eg. CurrentDate -> `<current-date>`... (x) `<currentdate>`
12. Investigate why all reactive variables have references in watchCallbacks.
13. Investigate why setAttribute is called twice as much as it needs to be called.
14. Remove repetition of saving attributes' contents eg. :for.
15. Implement deep object watching.
16. Make better dependency extractor that would support `data.property`.
17. Make events aware of context - now they don't get reactive variables' values.
18. Investigate why would `header` component be rendered twice (due to naming conflict).

## Second Line of TODOs

1. Explore how to handle nested loops effectively.
2. Enhance the system for reactive array updates to ensure minimal DOM manipulation.
3. Cache values inside observers (computed properties) to optimize performance.

## Third Line of TODOs

1. Add support for SCSS to enhance styling capabilities.
2. Introduce TypeScript support for improved development experience and type safety.
3. Implement the `f-model=""` directive for two-way data binding.
4. Fix computeds running only if they are returned and gotten from the useStore().
5. Introduce recursive components.

## Implemented Features

1. Variable interpolation with `<Paint></Paint>` tags, similar to Vue's `{{ }}` delimiters.
2. Reactive global stores accessed via the `useStore` method.
3. Reactive variables that automatically update the UI when their values change.
4. Event emitting and catching with the `@event` directive.
5. Reactive prop binding with `:prop`.
6. Two-way binding that functwions correctly.
7. Application of CSS directly from `component.style.sheet`.
8. `:for` for handling loops within components.
9. Value of type `checkbox` and `text` inputs are now reactive.
10. Migrate everything to Maps and Sets.

## Example Component: Counter

`````javascript
// Defining props.
export const props = ["new-id", "new-counter"];

export const emits = ["new-emit-attribute"];

export const Counter = ({
  ref,
  computed,
  emit,
  useStore,
  watch,
  onMounted,
  onBeforeMount,
  props: { newId, newCounter },
}) => {
  let counter = ref(1);
  let exampleNumber = ref(100);

  const computedValue = computed(() => {
    return (counter.value + exampleNumber.value) % 2 === 0 ? "Even." : "Odd.";
  });

  const { cardTitle } = useStore("cardStore");

  const incrementCounter = () => {
    emit("increment", {
      effect: () => {
        counter.value += 1;
      },
    });
  };

  const decrementCounter = () => {
    emit("decrement", {
      effect: () => {
        counter.value -= 1;
      },
    });
  };

  const demoText = "Demo - two way binding.";

  // watch(computedValue, (newValue, oldValue) => {
  //     console.log('newValue of computed', newValue, oldValue)
  // })

  const demoTwoWayBinding = () => {
    cardTitle.value = "Two way binding works!";
  };

  const humans = ref([
    {
      name: "Bart",
      age: 20,
      status: "😊",
    },
    {
      name: "Paul",
      age: 25,
      status: "😊",
    },
  ]);

  const template = ```html`
    <div class="counter">
      <div class="counter-display">
        Counter: {{ counter.value }} + {{ exampleNumber.value }} = {{
        computedValue.value }}
      </div>

      <div style="display: flex; justify-content: space-between; gap: 24px;">
        <button class="btn" @click="incrementCounter">Increment ++</button>
        <button class="btn" @click="decrementCounter">Decrement --</button>
        <button class="btn special" @click="demoTwoWayBinding">
          {{ demoText }}
        </button>
      </div>

      <slot name="message" :if="counter.value % 2 === 0"></slot>

      <Loop :for="human of humans.value">
        <div class="loop-item">
          <p>{{ human.name }}</p>
          <p>{{ human.age }}</p>
          <p>{{ human.status }}</p>
          <input type="checkbox" :checked="cardTitle.value.length > 3" />
        </div>
      </Loop>
    </div>
  ````;

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
    `;

  return {
    template,
    style,

    counter,
    exampleNumber,
    computedValue,
    cardTitle,
    humans,
    demoText,

    incrementCounter,
    decrementCounter,
    demoTwoWayBinding,
  };
};
`````
