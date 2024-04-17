# flow-js

## First Line of Necessary TODOs:

1. Remove expression attribute from expression elements (currently not implemented).
2. Add scoped styling (currently not implemented).
<!-- 3. Add `:for` directive to handle loops within components. -->
3. Prevent unnecessary updates by distinguishing between global and local updates.
4. Implement the `once` directive to bind events or effects that should only execute once.
5. Cache values inside observers (computed properties) to optimize performance.
6. Use reactive props that bind directly to object properties instead of reading from DOM attributes.

## Second Line of TODOs:

1. Explore how to handle nested loops effectively.
2. Enhance the system for reactive array updates to ensure minimal DOM manipulation.
3. Implement the `f-model=""` directive for two-way data binding.
4. Address the issue of excessive updates, ensuring more efficient change detection and rendering.

## Third Line of TODOs:

1. Add support for SCSS to enhance styling capabilities.
2. Introduce TypeScript support for improved development experience and type safety.

## Implemented Features:

1. Variable interpolation with `<Paint></Paint>` tags, similar to Vue's `{{ }}` delimiters.
2. Reactive global stores accessed via the `getStore` method.
3. Reactive variables that automatically update the UI when their values change.
4. Event emitting and catching with the `@event` directive.
5. Reactive prop binding with `:prop`.
6. Two-way binding that functions correctly.
7. Application of CSS directly from `component.style.sheet`.
8. `:for` for handling loops within components.
