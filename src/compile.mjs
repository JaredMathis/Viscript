import { assert } from "console";
import { identifier_is } from "./common.mjs";

export function compile(parsed) {
    return compile_function(parsed);
}

function compile_function(parsed) {
    assert(parsed.type === 'function');
    assert(identifier_is(parsed.name));

    return `
function ${parsed.name}(vars) {
    let ${parsed.variables.map(v => v.name).join(", ")};
    ${compile_function_variables_assign('input')};
}`

    function compile_function_variables_assign(filter) {
        return parsed.variables.filter(v => v[filter]).map(v => v.name).map(v => `${v} = vars.${v}`).join(", ")
    }
}

