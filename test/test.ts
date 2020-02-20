import { Validator, validate, ValidationError, ValidationErrorType, addRule } from '../src/index';
import { assert } from 'chai';

describe("test checku", () => {
    describe("#minLength maxLength length pattern bsonMaxBytes trim required namedRule customRule defaultRule", function () {
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

        it("bsonMaxBytes", () => {
            class Example {
                @Validator({ bsonMaxBytes: 20 })
                property: string;
            }
            const e = { property: ['1'] };
            validate(Example, e)
        });

        it("trime", () => {
            class Example {
                @Validator({ trim: true })
                property: string;
            }
            const e = { property: ' 1234567890 ' };
            validate(Example, e)
            assert(e.property == '1234567890')
        });

        it("required", () => {
            class Example {
                @Validator({ required: true })
                property: string;
            }
            const e = { property: '1234567890' };
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
                @Validator((value: string) => value.length > 2)
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

    describe("error#minLength maxLength length pattern bsonMaxBytes trim required namedRule customRule defaultRule", function () {
        it("minLength", () => {
            class Example {
                @Validator({ minLength: 10 })
                property: string;
            }
            const e = { property: '123456789' };
            let err: ValidationError;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err && err.type == ValidationErrorType.MinLength)
        });

        it("minLength", () => {
            class Example {
                @Validator({ minLength: 10 })
                property: any;
            }
            const e = { property: 1 };
            let err: ValidationError;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err && err.type == ValidationErrorType.Type)
        });

        it("maxLength", () => {
            class Example {
                @Validator({ maxLength: 10 })
                property: string;
            }
            const e = { property: '12345678901' };
            let err: ValidationError;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err && err.type == ValidationErrorType.MaxLength)
        });

        it("maxLength2", () => {
            class Example {
                @Validator({ maxLength: 10 })
                property: any;
            }
            const e = { property: 1 };
            let err: ValidationError;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err && err.type == ValidationErrorType.Type)
        });

        it("length", () => {
            class Example {
                @Validator({ length: 10 })
                property: string;
            }
            const e = { property: '123456789' };
            let err: ValidationError;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err && err.type == ValidationErrorType.Length)
        });

        it("length2", () => {
            class Example {
                @Validator({ length: 10 })
                property: any;
            }
            const e = { property: 1 };
            let err: ValidationError;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err && err.type == ValidationErrorType.Type)
        });

        it("pattern", () => {
            class Example {
                @Validator({ pattern: /abc/ })
                property: string;
            }
            const e = { property: '123ab3c21' };
            let err: ValidationError;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err && err.type == ValidationErrorType.Pattern)
        });

        it("bsonMaxBytes", () => {
            class Example {
                @Validator({ bsonMaxBytes: 20 })
                property: string;
            }
            const e = { property: '123' };
            let err: ValidationError;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err && err.type == ValidationErrorType.BsonMaxBytes)
        });

        it("trim", () => {
            class Example {
                @Validator({ trim: true })
                property: any;
            }
            const e = { property: 1 };
            let err: ValidationError;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err && err.type == ValidationErrorType.Type)
        });

        it("required", () => {
            class Example {
                @Validator({ required: true })
                property: string;
            }
            const e = {};
            let err: ValidationError;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err && err.type == ValidationErrorType.Required)
        });

        it("namedRule", () => {
            addRule("email", { pattern: /^\S+@\S+\.\S+$/, maxLength: 30, trim: true })
            class Example {
                @Validator('email1')
                property: string;
            }
            const e = { property: ' 200706991@qq.com ' };
            let err: ValidationError;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err && err.type == ValidationErrorType.NoRule)
        });

        it("customRule", () => {
            class Example {
                @Validator((value: string) => value.length > 20)
                property: string;
            }
            const e = { property: '1234567890' };
            let err: ValidationError;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err && err.type == ValidationErrorType.CustomRule)
        });

        it("defaultRule", () => {
            class Example {
                @Validator()
                property: string;
            }
            const e = {};
            let err: ValidationError;
            try {
                validate(Example, e)
            } catch (error) {
                err = error
            }
            assert(err && err.type == ValidationErrorType.Required)
        });
    })
});