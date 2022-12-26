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
     * Builds the default method name for the given hook.       
     * @param {string} hook - the hook to build the method name for.       
     * @returns {string} the default method name for the given hook.       
     */
    buildDefaultMethodName(hook) {
        options = {
            ...this.options,
            ...{defaultPrefix: 'default'}
        }
        return this.buildMethodName(options.defaultPrefix, hook)
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