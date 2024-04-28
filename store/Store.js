$Flow.defineStore('cardStore', ({ ref }) => {
    const cardTitle = ref('Bound Card title.')
    const cardDescription = ref('Card description.')

    return {
        cardTitle,
        cardDescription
    }
})