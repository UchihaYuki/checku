import { Validator, validate, addRule } from '../src/index';
import { assert } from 'chai';

describe("test checku", () => {
    describe("#required trim minLength maxLength length pattern gt gte lt lte eq namedRule customRule defaultRule", function () {
        it("required", () => {
            class Example {
                @Validator({ required: true })
                property: string;
            }
            const e = { property: '1234567890' };
            validate(Example, e)
        });

        it("trim", () => {
            class Example {
                @Validator({ trim: true })
                property: string;
            }
            const e = { property: ' 1234567890 ' };
            validate(Example, e)
            assert(e.property == '1234567890')
        });

        it("minLength", () => {
            class Example {
                @Validator({ minLength: 10 })
                property: string;
            }
            const e = { property: '1234567890' };
            validate(Example, e)
        });

        it("maxLength", () => {
            class Example {
                @Validator({ maxLength: 10 })
                property: string;
            }
            const e = { property: '1234567890' };
            validate(Example, e)
        });

        it("length", () => {
            class Example {
                @Validator({ length: 10 })
                property: string;
            }
            const e = { property: '1234567890' };
            validate(Example, e)
        });

        it("pattern", () => {
            class Example {
                @Validator({ pattern: /abc/ })
                property: string;
            }
            const e = { property: '123abc321' };
            validate(Example, e)
        });

        it("gt1", () => {
            class Example {
                @Validator({ gt: 10 })
                property: number;
            }
            const e = { property: 11 };
            validate(Example, e)
        });

        it("gt2", () => {
            class Example {
                @Validator({ gt: 'a' })
                property: string;
            }
            const e = { property: 'b' };
            validate(Example, e)
        });

        it("gte1", () => {
            class Example {
                @Validator({ gte: 10 })
                property: number;
            }
            const e = { property: 11 };
            validate(Example, e)
        });

        it("gte2", () => {
            class Example {
                @Validator({ gte: 'a' })
                property: string;
            }
            const e = { property: 'b' };
            validate(Example, e)
        });

        it("lt1", () => {
            class Example {
                @Validator({ lt: 10 })
                property: number;
            }
            const e = { property: 9 };
            validate(Example, e)
        });

        it("lt2", () => {
            class Example {
                @Validator({ lt: 'b' })
                property: string;
            }
            const e = { property: 'a' };
            validate(Example, e)
        });

        it("lte1", () => {
            class Example {
                @Validator({ lte: 10 })
                property: number;
            }
            const e = { property: 10 };
            validate(Example, e)
        });

        it("lte2", () => {
            class Example {
                @Validator({ lte: 'a' })
                property: string;
            }
            const e = { property: 'a' };
            validate(Example, e)
        });

        it("eq1", () => {
            class Example {
                @Validator({ eq: 1 })
                property: number;
            }
            const e = { property: 1 };
            validate(Example, e)
        });

        it("eq2", () => {
            class Example {
                @Validator({ eq: 'a' })
                property: string;
            }
            const e = { property: 'a' };
            validate(Example, e)
        });

        it("namedRule", () => {
            addRule("email", { pattern: /^\S+@\S+\.\S+$/, maxLength: 30, trim: true })
            class Example {
                @Validator('email')
                property: string;
            }
            const e = { property: ' 200706991@qq.com ' };
            validate(Example, e)
            assert(e.property == '200706991@qq.com')
        });

        it("namedRule2", () => {
            addRule("email", (value: string) => {
                if (new RegExp(/^\S+@\S+\.\S+$/).test(value)) {
                    return value;
                }
                return false;
            })
            class Example {
                @Validator('email')
                property: string;
            }
            const e = { property: '200706991@qq.com' };
            validate(Example, e)
            assert(e.property == '200706991@qq.com')
        });

        it("customRule", () => {
            class Example {
                @Validator((value: string) => assert(value.length > 2))
                property: string;
            }
            const e = { property: '1234567890' };
            validate(Example, e)
        });

        it("defaultRule", () => {
            class Example {
                @Validator()
                property: string;
            }
            const e = { property: '1234567890' };
            validate(Example, e)
        });
    })

    describe("error#required trim minLength maxLength length pattern gt gte lt lte eq namedRule customRule defaultRule", function () {
        it("required", () => {
            class Example {
                @Validator({ required: true })
                property: string;
            }
            const e = {};
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("trim", () => {
            class Example {
                @Validator({ trim: true })
                property: any;
            }
            const e = { property: 1 };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("minLength", () => {
            class Example {
                @Validator({ minLength: 10 })
                property: string;
            }
            const e = { property: '123456789' };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("minLength", () => {
            class Example {
                @Validator({ minLength: 10 })
                property: any;
            }
            const e = { property: 1 };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("maxLength", () => {
            class Example {
                @Validator({ maxLength: 10 })
                property: string;
            }
            const e = { property: '12345678901' };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("maxLength2", () => {
            class Example {
                @Validator({ maxLength: 10 })
                property: any;
            }
            const e = { property: 1 };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("length", () => {
            class Example {
                @Validator({ length: 10 })
                property: string;
            }
            const e = { property: '123456789' };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("length2", () => {
            class Example {
                @Validator({ length: 10 })
                property: any;
            }
            const e = { property: 1 };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("pattern", () => {
            class Example {
                @Validator({ pattern: /abc/ })
                property: string;
            }
            const e = { property: '123ab3c21' };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("gt1", () => {
            class Example {
                @Validator({ gt: 10 })
                property: number;
            }
            const e = { property: 10 };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("gt2", () => {
            class Example {
                @Validator({ gt: 'a' })
                property: string;
            }
            const e = { property: 'a' };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("gte1", () => {
            class Example {
                @Validator({ gte: 10 })
                property: number;
            }
            const e = { property: 9 };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("gte2", () => {
            class Example {
                @Validator({ gte: 'a' })
                property: string;
            }
            const e = { property: 'A' };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("lt1", () => {
            class Example {
                @Validator({ lt: 10 })
                property: number;
            }
            const e = { property: 11 };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("lt2", () => {
            class Example {
                @Validator({ lt: 'b' })
                property: string;
            }
            const e = { property: 'b' };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("lte1", () => {
            class Example {
                @Validator({ lte: 10 })
                property: number;
            }
            const e = { property: 11 };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("lte2", () => {
            class Example {
                @Validator({ lte: 'a' })
                property: string;
            }
            const e = { property: 'b' };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("eq1", () => {
            class Example {
                @Validator({ eq: 1 })
                property: number;
            }
            const e = { property: 2 };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("eq2", () => {
            class Example {
                @Validator({ eq: 'a' })
                property: string;
            }
            const e = { property: 'b' };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("namedRule", () => {
            addRule("email", { pattern: /^\S+@\S+\.\S+$/, maxLength: 30, trim: true })
            class Example {
                @Validator('email1')
                property: string;
            }
            const e = { property: ' 200706991@qq.com ' };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("customRule", () => {
            class Example {
                @Validator((value: string) => assert(value.length > 20))
                property: string;
            }
            const e = { property: '1234567890' };
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });

        it("defaultRule", () => {
            class Example {
                @Validator()
                property: string;
            }
            const e = {};
            let err: Error;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err)
        });
    })
});