const { camelCase, snakeCase, pascalCase, dotCase } = require("change-case");

/**
 * A class that handles the dispatching of events.
 */
class Dispatcher {

    /**
     * Creates an instance of Dispatcher.
     * @memberof Dispatcher
     */
    constructor() {
        this.options = {
            format: "camelCase",
            defaultPrefix: "default",
        }
    }

    /**
     * Dispatch a method call to the correct method.
     * @param {object} caller - The object that is calling the method.
     * @param {string} hook - The name of the method to call.
     * @param {any[]} parameters - The parameters to pass to the method.
     * @returns The return value of the method.
     * @example
     *
     * class MyClass {
     *  // you will invoke find with a hook name as first parameter.
     *  // Remaining parameters will be passed to hook method.
     *  find(hook) {
     *      let d = new Dispatcher();
     *      return d.dispatch('find', arguments)
     *  }
     *
     *
      * // Find all the sites that match the given options.
      * // @param {object} options - the options to find sites with.
      * // @returns {object[]} - an array of objects containing the site properties.
     *  findAll(options = {}) {
     *      return [{}]
     *  }
     *
     *  findRange(offset, count, options = {}) {
     *     options = {
     *         ...options,
     *         ...{offset, count}
     *     }
     *     return this.find('all', options)
     *  }
     * }
     *
     * // In your code:
     *
     * let m = new MyClass();
     * let records = m.find('all', {}) // will dispatch find's all hook to findAll method.
     *
     * // or,if the caller is a string, it's a hook name, and the parameters are the hook parameters.
     *  let records = m.find('range', 10, 25, options) // will dispatch find's range hook to findRange method, which invoke find's all hook
     */
    dispatch(caller, hook, parameters) {
        let args = [];
        for (let i = 0; i < parameters.length; i++) {
            args.push(parameters[i])
        }

        let fn = this.buildMethodName(hook, parameters[0])
        if (this.methodExists(caller, fn)) {
            return this.callMethod(caller, fn, args.slice(1))
        }

        fn = this.buildDefaultMethodName(hook);
        if (this.methodExists(caller, fn)) {
            return this.callMethod(caller, fn, args)
        }

        throw new Error(`Invalid dispatch destination method: '${hook}' for '${caller.name}' class`)
    }

    /**
     * Builds a method name for the given base and hook.
     * @param {string} base - the base of the method name.
     * @param {string} hook - the hook of the method name.
     * @param {object} [options={}] - the options for the method name.
     * @returns {string} the method name.
     */
    buildMethodName(base, hook, options = {}) {
        options = {
            ...this.options,
            ...options,
        }
        let s = `${base} ${hook}`;
        switch (options.format) {
            case "pascalCase":
                return pascalCase(s);
            case "snakeCase":
                return snakeCase(s);
            case "dotCase":
                return dotCase(s)
            default:
                return camelCase(s)
        }
    }

    /**
     * Builds a method name for the given hook.
     * @param {string} hook - the hook to build a method name for.
     * @param {object} [options={}] - the options for the method name.
     * @param {string} [options.defaultPrefix] - the default prefix to use for the method name.
     * @returns {string} the method name for the given hook.
     */
    buildDefaultMethodName(base, options = {}) {
        options = {
            ...this.options,
            ...{defaultPrefix: 'default'}
        }
        return this.buildMethodName(options.defaultPrefix, base)
    }

    /**
     * Checks if a method exists in a given object.
     * @param {object} caller - the object to check for the method in
     * @param {string} fn - the name of the method to check for
     * @returns {boolean} - true if the method exists, false otherwise
     */
    methodExists(caller, fn) {
        let e = `typeof caller['${fn}'] === 'function'`
        return eval(e)
    }

    /**
     * Calls a method on the caller object.
     * @param {object} caller - the object that contains the method.
     * @param {string} fn - the name of the method to call.
     * @param {any[]} params - the parameters to pass to the method.
     * @returns the result of the method call.
     */
    callMethod(caller, fn, params) {
        let args = params.map(p => {
            return JSON.stringify(p)
        })

        let e = `caller['${fn}'](${args.join(', ')})`;
        return eval(e)
    }
}

module.exports = {
    Dispatcher,
}