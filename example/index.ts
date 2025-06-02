"use strict";
import "./global.css"
import { Vind } from "../src/main";
import { cardStore } from "./store/cardStore";
import { dateStore } from "./store/dateStore";
import * as App from "./components/App";
import * as Card from "./components/Card";
import * as Counter from "./components/Counter";
import * as CurrentDate from "./components/CurrentDate";
import * as AppHeader from "./components/AppHeader";
import * as Example from "./components/Example";
import * as TestingReactivity from "./components/TestingReactivity";
import * as NewComponent from "./components/NewComponent"
import * as Child from "./components/Child"

Vind.render(() => {
    // @ts-ignore
    Vind.defineStores([cardStore, dateStore]);
    // @ts-ignore
    Vind.defineComponents([App, Card, Counter, CurrentDate, AppHeader, Example, TestingReactivity, NewComponent, Child]);
});
