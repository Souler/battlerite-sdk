import { isDate, isNumber, isString, isUndefined } from 'lodash';

export function optionalString(val: any, varname: string = '') {
    if (isUndefined(val)) {
        return;
    }
    if (!isString(val)) {
        throw new TypeError(`${varname} must be a string`);
    }
}

export function optionalNumber(val: any, varname: string = '') {
    if (isUndefined(val)) {
        return;
    }
    if (!isNumber(val)) {
        throw new TypeError(`${varname} must be a number`);
    }
}

export function optionalDate(val: any, varname: string = '') {
    if (isUndefined(val)) {
        return;
    }
    if (!isDate(val)) {
        throw new TypeError(`${varname} must be a Date instance`);
    }
}

export function optionalArray(val: any, varname: string = '') {
    if (isUndefined(val)) {
        return;
    }
    if (!Array.isArray(val)) {
        throw new TypeError(`${varname} must be an Array`);
    }
}

export function optionalStringArray(val: any, varname: string = '') {
    optionalArray(val, varname);
    if (isUndefined(val)) {
        return;
    }
    if ((val as Array<any>).some((v) => !isString(v))) {
        throw new TypeError(`${varname} must only contain strings`)
    }
    
}

export function optionalNumberArray(val: any, varname: string = '') {
    optionalArray(val, varname);
    if (isUndefined(val)) {
        return;
    }
    if ((val as Array<any>).some((v) => !isNumber(v))) {
        throw new TypeError(`${varname} must only contain numbers`)
    }
    
}
