const index = require("../index")
// @ponicode
describe("index.Dispatcher.buildMethodName", () => {
    let inst

    beforeEach(() => {
        inst = new index.Dispatcher()
    })

    test("0", () => {
        let result = inst.buildMethodName("find", "all", undefined)
        expect(result).toBe("findAll")
    })

    test("1", () => {
        let result = inst.buildMethodName("find", "all", { format: "pascalCase" })
        expect(result).toBe("FindAll")
    })

    test("2", () => {
        let result = inst.buildMethodName("find", "all Applications", undefined)
        expect(result).toBe("findAllApplications")
    })

    test("3", () => {
        let result = inst.buildMethodName("find", "all applications", undefined)
        expect(result).toBe("findAllApplications")
    })

    test("4", () => {
        let result = inst.buildMethodName("find", "all", { format: "snakeCase" })
        expect(result).toBe("find_all")
    })

    test("5", () => {
        let result = inst.buildMethodName("find", "all Applications", { format: "snakeCase" })
        expect(result).toBe("find_all_applications")
    })

    test("6", () => {
        let result = inst.buildMethodName("find", "all Applications", { format: "dotCase" })
        expect(result).toBe("find.all.applications")
    })
})
