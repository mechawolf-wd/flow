"use strict";

import { Vind } from "./node_modules/@vind/index.js";
import { cardStore } from "./store/cardStore.js";
import { dateStore } from "./store/dateStore.js";
import * as App from "./App.js";
import * as Card from "./components/Card.js";
import * as Counter from "./components/Counter.js";
import * as CurrentDate from "./components/CurrentDate.js";
import * as AppHeader from "./components/AppHeader.js";
import * as Example from "./components/Example.js";
import * as TestingReactivity from "./components/TestingReactivity.js";

Vind.render(() => {
    Vind.defineStores([cardStore, dateStore]);
    Vind.defineComponents([App, Card, Counter, CurrentDate, AppHeader, Example, TestingReactivity]);
});
