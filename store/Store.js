import { generateStore } from '../node_modules/@flow/store/generateStore.js'

export const cardStore = generateStore('cardStore', ({ variable }) => {
    const cardTitle = variable('Bound Card title.')
    const cardDescription = variable('Card description.')

    return {
        cardTitle,
        cardDescription
    }
})