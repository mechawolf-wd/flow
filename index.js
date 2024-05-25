'use strict';

import { Flow } from "./node_modules/@flow/index.js";

import { cardStore } from "./store/cardStore.js";
import { dateStore } from "./store/dateStore.js";
import * as App from "./App.js";
import * as Card from "./components/Card.js";
import * as Counter from "./components/Counter.js";
import * as CurrentDate from "./components/CurrentDate.js";
import * as Header from "./components/Header.js";
import * as Example from "./components/Example.js";

Flow.defineStores([cardStore, dateStore]);
Flow.defineComponents([App, Card, Counter, CurrentDate, Header, Example]);

Flow.render();
