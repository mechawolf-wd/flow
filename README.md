# Vind-JS Framework

<img src="https://img.shields.io/badge/Firefox-FF7139?style=for-the-badge&logo=Firefox-Browser&logoColor=white">
<img src="https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white">
<img src="https://img.shields.io/badge/Safari-000000?style=for-the-badge&logo=Safari&logoColor=white"><br>

## Overview

Vind-JS is a minimalist JavaScript framework tailored for building interactive user interfaces with a strong emphasis on reactivity and state management. Unlike other frameworks, Vind-JS does not require a build step, node_modules, or any additional libraries. It is solely JavaScript, making it lightweight and easy to integrate into any project. Vind-JS resembles Vue.js in its approach, providing a familiar and efficient development experience.

## Features

- 🔄 **Reactive Data Binding**: Changes in your state automatically reflect in your UI without manual intervention.
- 📦 **Efficient State Management**: Comes with built-in methods for managing global and local states, enhancing the predictability of data flow.
- 🔧 **Advanced Directives**: Supports modern directives such as `:for` for loops, `:if` for conditional rendering, and `@event` for handling events.
- 🛠 **Modular Architecture**: Encourages the use of reusable, modular components that can be easily integrated and tested.
- 🚀 **No Build Step**: Directly include Vind-JS in your project without any build process.
- 🛡 **Zero Dependencies**: No need for node_modules or additional libraries.

## First Line of Necessary TODOs

1. Make props readonly!
2. Implement the `once` directive to bind events or effects that should only execute once.
3. Implement a handling mechanism for components' names casing. eg. CurrentDate -> `<current-date>`... (x) `<currentdate>`

## Second Line of TODOs

3. Implement `ref=""` directive for referencing DOM elements.
4. Cache values inside observers (computed properties) to optimize performance.

## Third Line of TODOs

1. Add support for SCSS to enhance styling capabilities.
2. Introduce TypeScript support for improved development experience and type safety.
3. Fix computed properties running only if they are returned and gotten from the stores.
4. Remove repetition of saving attributes' contents eg. :for.
5. Introduce recursive components.

## Implemented Features

1. Reactive variables that can be interpolated in template with `{{ example.value }}`.
2. Computed properties that recompute their value when one of the dependencies change.
3. Global state management with the `stores` variable.
4. Custom events handling with the `emit()` method.
5. Directives for conditional rendering and loops (naming convention: `:if`, `:for`).
6. Event handling with the `@event` directive.
7. Data binding possible with prepending `:` to the attribute name.
8. `watch()` method for watching reactive variables.
9. Looping through arrays with the `:for` directive.
10. Reactive props that are defined with the `props` array.
11. `onMounted` and `onBeforeMount` lifecycle hooks.
12. `<Insert>` component for putting HTML content into `<Drawer>` tags, aka <slot>s and <template>s.
13. No-import components that are automatically imported and registered.
14. Deep reactive objects that rerender influenced DOM nodes and attributes.
15. Nested Loops that can reference the parent loop's variables.

## Example Component: Counter

`````javascript
export const Props = {
  newId: {
    type: String,
    default: "",
    validator: (newId) => {
      return newId.length < 2;
    },
  },
  newCounter: {
    type: String,
    default: "Default value of newCounter.",
  },
};

export const Emits = ["new-emit-attribute"];

export const Template =  ```html`
  <div class="counter">
    <div
      class="counter-display"
      :class="{ colorRed: () => counter.value % 2 === 0 }"
    >
      Counter: {{ counter.value }} + {{ exampleNumber.value }} = {{
      computedValue.value }}
    </div>

    <div style="display: flex; justify-content: space-between; gap: 24px;">
      <button class="btn" @click="incrementCounter">Increment ++</button>
      <button class="btn" @click="decrementCounter">Decrement --</button>
      <button class="btn special" @click="$emit('change-path')">
        {{ demoText }}
      </button>
    </div>

    <Drawer name="message"></Drawer>

    <div :for="human of humans">
      <div class="loop-item">
        <p :class="{ colorRed: () => cardTitle.value.length > 3 }">
          {{ human.name }}
        </p>
        <p>{{ human.age }}</p>
        <p>{{ human.status }}</p>
        <input type="checkbox" :checked="human.age > 2" />
        <input :model="human.age" />
      </div>

      <div :for="type in human.cats" style="display: flex; gap: 8px;">
        {{ type.value }}
      </div>
    </div>
  </div>
````;

export const Counter = () => {
  const counter = ref(1);
  const exampleNumber = ref(100);

  const computedValue = computed(() => {
    return counter.value + exampleNumber.value;
  });

  watch([() => computedValue.value], (n, p) => {
    console.log(n, p);
  });

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
    humans.push({
      name: "Last",
      age: 99,
      status: "😊",
      cats: ["Furr", "Puff", "Catto"],
    });
  }, 500);

  setTimeout(() => {
    humans.sort((a, b) => b.age - a.age);
  }, 1000);

  setTimeout(() => {
    humans[0].cats.pop();
  }, 2500);

  return {
    counter,
    exampleNumber,
    computedValue,
    cardTitle,
    humans,
    types,
    demoText,
    cards,

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

    .colorRed {
        color: orangered;
    }
`;
`````
