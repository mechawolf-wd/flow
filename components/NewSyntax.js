export const test = ref(200)
export const value = ref(2000)

export const Template = /* HTML */ `
    <p>{{ test.value }}</p>
    <p>{{ computedTest.value }}</p>
`