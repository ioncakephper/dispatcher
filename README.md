
# dispatcher

Dispatch hooks of a hook-able method to methods named automatically.

## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Usage

```js
const { Dispatcher } = require("dispatcher");

class Example {

    find(hook) {
        let d = new Dispatcher();
        return d.dispatch(this, 'find', arguments)
    }

    // method for hook 'all'
    findAll(options = {}) {
        // pass options to a db query
        // return DB.query(options)
        return [{}]
    }

    // default method for hook-able find
    defaultFind(hook, ...args) {
        // return a default answer based on hook and available arguments
    }
}

// in your code:
let options = {}

let m = new Example();
let records = m.find('all', options) // will invoke findAll(options)

// when no hook method exists for a hook, the defaultFind is executed.
let r = m.find("first", options)
```
