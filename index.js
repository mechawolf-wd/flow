'use strict';

import { Flow } from "./node_modules/@flow/index.js";

import { cardStore, dateStore } from "./store/Store.js";
import * as App from "./App.js";
import * as Card from "./components/Card.js";
import * as Counter from "./components/Counter.js";
import * as CurrentDate from "./components/CurrentDate.js";
import * as Example from "./components/Example.js";

Flow.defineStores([cardStore, dateStore]);
Flow.defineComponents([App, Card, Counter, CurrentDate, Example]);

Flow.render();
