import { App } from './App.js'
import { Counter } from './components/Counter.js'
import { Card } from './components/Card.js'
import { Example } from './components/Example.js'
import { Flow } from './node_modules/@flow/index.js'
import { cardStore } from './store/Store.js'

Flow.connect(() => {
    Flow.mountStore(cardStore)

    // Mounting directly in the scope of this function
    // makes the compoment global

    // TODO: build a mechanism to handle direct directed imports
    Flow.mount(App).forEach(node => {
        const cardNodes = Flow.mount(Card, node)

        cardNodes.forEach(cardNode => {
            const counterNodes = Flow.mount(Counter, cardNode)

            counterNodes.forEach(counterNode => {
                Flow.mount(Example, counterNode)
            })
        })
    })
})