export const test = ref(200)

export const computedTest = computed(() => {
    return test.value + 100
})

export const Template = /* HTML */ `
    <p>{{ test.value }}</p>
    <p>{{ computedTest.value }}</p>
`