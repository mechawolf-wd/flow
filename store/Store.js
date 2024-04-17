import { generateStore } from '../node_modules/@flow/store/generateStore.js'

export const cardStore = generateStore('cardStore', ({ ref }) => {
    const cardTitle = ref('Bound Card title.')
    const cardDescription = ref('Card description.')

    return {
        cardTitle,
        cardDescription
    }
})