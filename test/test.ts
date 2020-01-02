import { validator, validate, ValidationError, ValidationErrorType } from '../src/index';
import { assert } from 'chai';

describe("test checku", () => {
    class LoginRequest {
        @validator({ pattern: /^\S+@\S+\.\S+$/, maxLength: 30, trim: true })
        email: string;
        @validator({ minLength: 8, maxLength: 20 })
        password: string;
        @validator({bsonBytes: 20})
        hobbies: string[];
    }

    it("all properties valid", () => {        
        const lr = new LoginRequest();
        lr.email = "200706991@qq.com";
        lr.password = "12345678"
        lr.hobbies = ["play"]
        let e;
        try {
            validate(LoginRequest, lr)
        } catch (err) {
            e = err
        }
        assert(e == undefined)
    });

    it("min length", () => {        
        const lr = new LoginRequest();
        lr.email = "200706991@qq.com";
        lr.password = "1234567"
        lr.hobbies = ["play"]
        let e: ValidationError;
        try {
            validate(LoginRequest, lr)
        } catch (err) {
            e = err
        }
        assert(e && e.type == ValidationErrorType.MinLength, e ? ValidationErrorType[e.type] : "no ValidationError")
    });

    it("max length", () => {        
        const lr = new LoginRequest();
        lr.email = "200706991@qq.com";
        lr.password = "123456789012345678901"
        lr.hobbies = ["play"]
        let e: ValidationError;
        try {
            validate(LoginRequest, lr)
        } catch (err) {
            e = err
        }
        assert(e && e.type == ValidationErrorType.MaxLength, e ? ValidationErrorType[e.type] : "no ValidationError")
    });

    it("pattern", () => {        
        const lr = new LoginRequest();
        lr.email = "200706991@qqcom";
        lr.password = "123456789012345678901"
        lr.hobbies = ["play"]
        let e: ValidationError;
        try {
            validate(LoginRequest, lr)
        } catch (err) {
            e = err
        }
        assert(e && e.type == ValidationErrorType.Pattern, e ? ValidationErrorType[e.type] : "no ValidationError")
    });

    it("required", () => {        
        const lr = new LoginRequest();
        lr.email = "200706991@qq.com";
        lr.hobbies = ["play"]
        let e: ValidationError;
        try {
            validate(LoginRequest, lr)
        } catch (err) {
            e = err
        }
        assert(e && e.type == ValidationErrorType.Required, e ? ValidationErrorType[e.type] : "no ValidationError")
    });

    it("trim", () => {        
        const lr = new LoginRequest();
        lr.email = "  200706991@qq.com  ";
        lr.password = "12345678";        
        lr.hobbies = ["play"]
        let e: ValidationError;
        try {
            validate(LoginRequest, lr)
        } catch (err) {
            e = err
        }
        assert(lr.email == "200706991@qq.com")
    });

    it("bson bytes", () => {        
        const lr = new LoginRequest();
        lr.email = "200706991@qq.com";
        lr.password = "12345678";
        lr.hobbies = ["play", "play", "play", "play", "play"]
        let e: ValidationError;
        try {
            validate(LoginRequest, lr)
        } catch (err) {
            e = err
        }
        assert(e && e.type == ValidationErrorType.Bsonbytes, e ? ValidationErrorType[e.type] : "no ValidationError")
    });

    class User
    {
        @validator({trim: true})
        fullName: any;
        @validator({minLength: 2})
        firstName: any;
        @validator({maxLength: 10})
        lastName: any;
    }

    it("type1", () => {        
        const u = new User();
        u.fullName = 1;
        u.firstName = "xue";
        u.lastName = "zhang"
        let e: ValidationError;
        try {
            validate(User, u)
        } catch (err) {
            e = err
        }
        assert(e && e.type == ValidationErrorType.Type, e ? ValidationErrorType[e.type] : "no ValidationError")
    });

    it("type2", () => {        
        const u = new User();
        u.fullName = "zhang xue";
        u.firstName = 1;
        u.lastName = "zhang"
        let e: ValidationError;
        try {
            validate(User, u)
        } catch (err) {
            e = err
        }
        assert(e && e.type == ValidationErrorType.Type, e ? ValidationErrorType[e.type] : "no ValidationError")
    });

    it("type3", () => {        
        const u = new User();
        u.fullName = "zhang xue";
        u.firstName = "xue";
        u.lastName = 3;
        let e: ValidationError;
        try {
            validate(User, u)
        } catch (err) {
            e = err
        }
        assert(e && e.type == ValidationErrorType.Type, e ? ValidationErrorType[e.type] : "no ValidationError")
    });
});