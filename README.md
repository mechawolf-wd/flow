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
5. Fix Checkboxes - if touched once, they keep their user-manipulated state.
6. Decide whether to keep `<loop></loop>` tags inside production HTML.
7. Implement `ref=""` directive for referencing DOM elements.
8. Implement the user's ability to watch props.
9. Implement a handling mechanism for components' names casing. eg. CurrentDate -> `<current-date>`... (x) `<currentdate>`
10. Remove repetition of saving attributes' contents eg. :for.
11. Implement deep object watching.
12. Make events aware of context - now they don't get reactive variables' values.
13. Investigate why would `header` component be rendered twice (due to naming conflict).
14. Use Functions constructor to handle no-context-destructurized component template.
15. Expand ref's ability to handle reactive updates when nested objects are defined in its body.
16. Change reactive variable's parameter names (configuration, variableReference) so that they don't clash with others.

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

1. Reactive variables that can be interpolated in template with {{ example.value }}.
2. Computed properties that recompute their value when one of the dependencies change.
3. Global state management with the useStore() hook.
4. Custom events handling with the emit() method.
5. Directives for conditional rendering and loops (naming convention: `:if`, `:for`).
6. Event handling with the `@event` directive.
7. Data binding possible with prepending `:` to the atwttribute name.
8. watch() method for watching reactive variables.
9. Looping through arrays with the `<Loop></Loop>` component.
10. Reactive props that are defined with the `props` array.
11. onMounted and onBeforeMount lifecycle hooks.
12. <Insert> component for putting HTML content into <Drawer> tags. aka. slots and templates.
13. No-import components that are automatically imported and registered.
14. <Loop> component that loops through arrays.

## Example Component: Counter

`````javascript
export const props = ["new-id", "new-counter"];

export const emits = ["new-emit-attribute"];

export const template = ```html`
  <div class="counter">
    <div class="counter-display">
      Counter: {{ counter.value }} + {{ exampleNumber.value }} = {{
      computedValue.value }}
    </div>

    <div style="display: flex; justify-content: space-between; gap: 24px;">
      <button class="btn" @click="incrementCounter">Increment ++</button>
      <button class="btn" @click="decrementCounter">Decrement --</button>
      <button class="btn special" @click="() => $emit('change-path')">
        {{ demoText }}
      </button>
    </div>

    <Drawer name="message"></Drawer>

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

export const Counter = () => {
  const counter = ref(1);
  const exampleNumber = ref(100);

  const computedValue = computed(() => {
    return counter.value + exampleNumber.value;
  });

  watch(computedValue, (n, p) => {
    console.log(n, p);
  });

  const { cardTitle } = useStore("cardStore");

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
      age: 20,
      status: "😊",
    },
    {
      name: "Paul",
      age: 25,
      status: "😊",
    },
  ]);

  return {
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

export const style = `
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
`````
