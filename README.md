# utesting-js

**GitHub:** https://github.com/s0urcedev/utesting-js

**NPM:** https://www.npmjs.com/package/utesting

JS module for unit testing

## Installation:

```console
npm install utesting
```

## Importing:

```js
const ResultState = require("utesting").ResultState; // not necessary
const ResultStates = require("utesting").ResultStates; // not necessary
const Unit = require("utesting").Unit; // not necessary
const TestCase = require("utesting").TestCase; // necessary (for creating test cases)
const TestGroup = require("utesting").TestGroup; // not necessary
const TestCaseResult = require("utesting").TestCaseResult; // not necessary
const Test = require("utesting").Test; // necessary (for additing and running testing)
```

## Using:

`test(group, output)` — test test group

`addTestUnit(callback, cases, onlyErrors, onlyTime, noPrint)` — same as mark_test_unit, but can't be used as decorator

`testAll(fileName)` — running testing all added units

And other documentation in `utesting/index.js` and examples in `examples.js`
