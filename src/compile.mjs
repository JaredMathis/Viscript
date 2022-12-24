import { assert } from "console";
import { identifier_is } from "./common.mjs";

export function compile(parsed) {
    return compile_function(parsed);
}

function compile_function(parsed) {
    assert(parsed.type === 'function');
    assert(identifier_is(parsed.name));

    return `
function ${parsed.name}() {

}`
}

