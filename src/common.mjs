import fs from 'fs';

export async function file_open(file_path) {
    return await fs.promises.readFile(file_path, 'utf-8');
}
export function json_parse(unparsed) {
    return JSON.parse(unparsed);
}
export async function file_json_open(file_path) {
    let unparsed = await file_open(file_path);
    return json_parse(unparsed);
}    
export function assert(condition) {
    if (condition !== true) {
        throw new Error('Expecting true')
    }
}
export function string_is(s) {
    return type_same(s, '');
}
export function type_same(a,b) {
    return typeof(a) === typeof(b);
}
export function character_is(s) {
    return string_is(s) && s.length === 1;
}
export function letters_has(s) {
    return s.toLowerCase() !== s.toUpperCase();
}
export function letter_is(s) {
    return character_is(s) && letters_has(s);
}
export function letters_all_generic(s, lambda) {
    if (!lambda(s[0])) {
        return false;
    }
    for (let c of s) {
        if (!lambda(c)) {
            return false;
        }
    }
    return true;
}
export function letters_all(s) {
    return letters_all_generic(s, letter_is);
}
export function digit_is(s) {
    return character_is(s) && '1234567890'.includes(s);
}
export function underscore_is(s) {
    return s === '_';
}
export function letter_or_digit_or_underscore_is(s) {
    let predicates = [
        letter_is,
        digit_is,
        underscore_is
    ]
    for (let p of predicates) {
        if (p(s)) {
            return true;
        }
    }
    return false;
}
export function letters_or_digits_or_underscore_all(s) {
    return letters_all_generic(s, letter_or_digit_or_underscore_is);
}
export function identifier_is(s) {
    return letters_all(s[0]) && letters_or_digits_or_underscore_all(s.slice(1));
}