import { assert, digit_is, identifier_is, letters_all_generic, string_is } from "./common.mjs";

export function compile(parsed) {
    return compile_function(parsed);
}

function compile_function(parsed) {
    assert(parsed.type === 'function');
    assert(identifier_is(parsed.name));

    let vars_dot = "vars.";
    return `
function ${parsed.name}(vars) {
    let ${parsed.variables.map(v => v.name).join(", ")};
    ${compile_function_variables_assign('input', '', vars_dot)};
    ${compile_function_root(parsed.root)};
    ${compile_function_variables_assign('output', vars_dot, '')};
}`

    function compile_function_variables_assign(filter, prefix1, prefix2) {
        return parsed.variables.filter(v => v[filter]).map(v => v.name).map(v => `${prefix1}${v} = ${prefix2}${v}`).join(", ")
    }
}

function compile_function_root(root) {
    assert(identifier_is(root.type));
    let result = eval("compile_" + root.type)(root);
    assert(string_is(result));
    return result;
}

function compile_number(root) {
    assert(identifier_is(root.output));
    assert(letters_all_generic(root.value, digit_is));
    return `${root.output}=${root.value}`;
}

function compile_code(root) {
    return root.value;
}

