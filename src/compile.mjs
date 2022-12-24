import { array_is, assert, digit_is, identifier_is, letters_all_generic, string_is } from "./common.mjs";

export function compile(parsed) {
    return compile_function(parsed);
}

function compile_function(parsed) {
    assert(parsed.type === 'function');
    assert(identifier_is(parsed.name));

    let vars_dot = "vars.";
    return `
async function ${parsed.name}(vars) {
    let ${parsed.variables.map(v => v.name).join(", ")};
    ${compile_function_variables_assign(parsed.variables, 'input', '', vars_dot)};
    let _call;
    ${compile_function_root(parsed.root)};
    ${compile_function_variables_assign(parsed.variables, 'output', vars_dot, '')};
}`
}    
function compile_function_variables_assign(vars, filter, prefix1, prefix2) {
    return vars.filter(v => v[filter]).map(v => v.name).map(v => `${prefix1}${v} = ${prefix2}${v}`).join(", ")
}

function compile_function_root(root) {
    assert(identifier_is(root.type));
    let result = eval("compile_" + root.type)(root);
    assert(string_is(result));
    return result;
}

function compile_call(root) {
    assert(identifier_is(root.name));
    return `_call = {};
${Object.keys(root.inputs || []).map(name => `_call.${name} = ${root.inputs[name].name}`).join(", ")};
await ${root.name}(_call);
${Object.keys(root.outputs || []).map(name => `${root.outputs[name].name} = _call.${name}`).join(", ")};`
}

function compile_steps(root) {
    assert(array_is(root.value));
    return root.value.map(v => compile_function_root(v)).join(";\n");
}

function compile_number(root) {
    assert(identifier_is(root.output));
    assert(letters_all_generic(root.value, digit_is));
    return `${root.output}=${root.value}`;
}
function compile_string(root) {
    assert(identifier_is(root.output));
    return `${root.output}="${root.value.replace('"', '\\"')}"`;
}

function compile_code(root) {
    return root.value;
}

