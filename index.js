import { Flow } from './node_modules/@flow/index.js'
import { cardStore } from './store/Store.js'
import './App.js'
import './components/Card.js'
import './components/Counter.js'
import './components/Example.js'

Flow.mountStore(cardStore)
Flow.renderApp()