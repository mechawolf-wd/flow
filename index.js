import { Flow } from "./node_modules/@flow/index.js";

import { cardStore, dateStore } from "./store/Store.js";
import { App } from "./App.js";
import { Card } from "./components/Card.js";
import { Counter } from "./components/Counter.js";
import { CurrentDate } from "./components/Counter.js";
import { Example } from "./components/Example.js";

Flow.defineStores([cardStore, dateStore]);
Flow.defineComponents([App, Card, Counter, CurrentDate, Example]);

Flow.render();
