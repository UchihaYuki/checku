import * as bson from 'bson';
import 'reflect-metadata';
// import 'weakmap-polyfill';
// import 'es6-symbol/implement';

const prototype_propertyKeys = new WeakMap<Object, (string | symbol)[]>();

const validatorMetadataKey = Symbol("validator");

export function validator(rule: Rule | string) {
    return (target: Object, propertyKey: string | symbol) => {
        const pks = prototype_propertyKeys.get(target);
        if (pks) {
            pks.push(propertyKey)
        }
        else {
            prototype_propertyKeys.set(target, [propertyKey])
        }
        Reflect.defineMetadata(validatorMetadataKey, rule, target, propertyKey)
    }
}

function getValidator(target: any, propertyKey: string | symbol) {
    return Reflect.getMetadata(validatorMetadataKey, target, propertyKey) as Rule;
}

function _validate(key: string | symbol, value: any, rule: Rule) {
    // console.debug(`key=${String(key)} value=${value} rule=${JSON.stringify(rule)}`)

    if (rule.required != false) {
        if (value == undefined || value == null) throw new ValidationError(key, value, ValidationErrorType.Required, rule)
    }

    if (value == undefined || value == null) return value

    if (rule.trim) {
        if (typeof value != 'string') throw new ValidationError(key, value, ValidationErrorType.Type, rule)
        value = value.trim();
    }

    if (rule.minLength != undefined) {
        if (typeof value != 'string') throw new ValidationError(key, value, ValidationErrorType.Type, rule)
        if (value.length < rule.minLength) throw new ValidationError(key, value, ValidationErrorType.MinLength, rule)
    }

    if (rule.maxLength != undefined) {
        if (typeof value != 'string') throw new ValidationError(key, value, ValidationErrorType.Type, rule)
        if (value.length > rule.maxLength) throw new ValidationError(key, value, ValidationErrorType.MaxLength, rule)
    }

    if (rule.pattern != undefined) {
        if (!rule.pattern.test(value)) throw new ValidationError(key, value, ValidationErrorType.Pattern, rule)
    }

    if (rule.bsonBytes != undefined) {
        try {
            if (bson.serialize(value).length > rule.bsonBytes) throw new ValidationError(key, value, ValidationErrorType.Bsonbytes, rule)
        } catch (err) {
            throw new ValidationError(key, value, ValidationErrorType.Bsonbytes, rule)
        }
    }

    return value;
}

export function validate(type: Function, instance: any) {
    const pks = prototype_propertyKeys.get(type.prototype)

    if (!pks) {
        return instance;
    }

    const validatedInstance: any = {};
    for (const pk of pks) {
        const value = instance[pk]
        let rule = getValidator(type.prototype, pk);        
        if (typeof rule == 'string')
        {
            rule = rules[rule]
            if (rule == undefined) throw new ValidationError(pk, value, ValidationErrorType.NoRule, undefined);
        }

        const t = _validate(pk, value, rule);
        validatedInstance[pk] = t;
    }
    return Object.assign(instance, validatedInstance)
}

const rules: { [name: string]: Rule } = {};

export function addRule(name: string, rule: Rule) {
    rules[name] = rule;
}

export class Rule {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    bsonBytes?: number;
    trim?: boolean;
    required?: boolean;
}

export class ValidationError extends Error {
    constructor(
        public key: string | symbol,
        public value: any,
        public type: ValidationErrorType,
        public rule: Rule) {
        super(`ValidationError`)
    }
}

export enum ValidationErrorType {
    MinLength,
    MaxLength,
    Pattern,
    Bsonbytes,
    Required,
    Type,
    NoRule,
}