import 'reflect-metadata';
import { inherits } from 'util';

const prototype_propertyKeys = new WeakMap<Object, (string | symbol)[]>();

const validatorMetadataKey = Symbol("Validator");

type CustomRule = (value: any) => any;

export function Validator(rule: Rule | string | CustomRule = {}) {
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

function getValidator(target: any, propertyKey: string | symbol): Rule | string | CustomRule {
    return Reflect.getMetadata(validatorMetadataKey, target, propertyKey);
}

function _validate(key: string | symbol, value: any, rule: Rule) {
    // console.debug(`key=${String(key)} value=${value} rule=${JSON.stringify(rule)}`)

    if ((rule.required != false) && value == undefined) throw new Error(`ValidationError: ${String(key)} is required`);

    if (value == undefined) return value;

    if ((rule.trim ||
        rule.minLength != undefined ||
        rule.maxLength != undefined ||
        rule.length != undefined ||
        rule.pattern != undefined) && (typeof value != 'string')) {
        throw new Error(`ValidationError: ${String(key)} should be string, but ${value} is ${typeof value}`)
    }

    if ((rule.gt != undefined ||
        rule.gte != undefined ||
        rule.lt != undefined ||
        rule.lte != undefined ||
        rule.eq != undefined) && (!['string', 'number'].includes(typeof value))) {
        throw new Error(`ValidationError: ${String(key)} should be string or number, but ${value} is ${typeof value}`)
    }

    if (rule.trim) {
        value = value.trim();
    }

    if (rule.minLength != undefined && value.length < rule.minLength) {
        throw new Error(`ValidationError: the length of ${String(key)} should be at least ${rule.minLength}, but the length of ${value} is ${value.length}`)
    }

    if (rule.maxLength != undefined && value.length > rule.maxLength) {
        throw new Error(`ValidationError: the length of ${String(key)} should be at most ${rule.maxLength}, but the length of ${value} is ${value.length}`)
    }

    if (rule.length != undefined && value.length != rule.length) {
        throw new Error(`ValidationError: the length of ${String(key)} should be ${rule.length}, but the length of ${value} is ${value.length}`)
    }

    if (rule.pattern != undefined && !rule.pattern.test(value)) {
        throw new Error(`ValidationError: ${String(key)}(${value}) should match pattern ${rule.pattern}`)
    }

    if (rule.gt != undefined && value <= rule.gt) {
        throw new Error(`ValidationError: ${String(key)}(${value}) should be greater than ${rule.gt}`)
    }

    if (rule.gte != undefined && value < rule.gte) {
        throw new Error(`ValidationError: ${String(key)}(${value}) should be greater than or equal to ${rule.gte}`)
    }

    if (rule.lt != undefined && value >= rule.lt) {
        throw new Error(`ValidationError: ${String(key)}(${value}) should be less than ${rule.lt}`)
    }

    if (rule.lte != undefined && value > rule.lte) {
        throw new Error(`ValidationError: ${String(key)}(${value}) should be less than or equal to ${rule.lte}`)
    }

    if (rule.eq != undefined && value != rule.eq) {
        throw new Error(`ValidationError: ${String(key)}(${value}) should be equal to ${rule.eq}`)
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

        if (typeof rule == 'string') {
            rule = rules[rule]
            if (rule == undefined) throw new Error(`ValidationError: rule ${rule} can't be found`);
        }

        if (typeof rule == 'function') {
            try {
                const customeRule = rule as CustomRule;
                const t = customeRule(value)
                validatedInstance[pk] = t;
            } catch (error) {
                throw new Error(`ValidationError ${error}`);
            }
            continue;
        }

        const t = _validate(pk, value, rule);
        validatedInstance[pk] = t;
    }

    return Object.assign(instance, validatedInstance)
}

const rules: { [name: string]: Rule | CustomRule } = {};

export function addRule(name: string, rule: Rule | CustomRule) {
    rules[name] = rule;
}

export class Rule {
    // string
    minLength?: number;
    maxLength?: number;
    length?: number;
    pattern?: RegExp;
    trim?: boolean;

    // number | string
    gt?: number | string;
    gte?: number | string;
    lt?: number | string;
    lte?: number | string;
    eq?: number | string;

    required?: boolean;
}