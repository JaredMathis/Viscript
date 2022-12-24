import { array_is, assert, digit_is, eval_global, identifier_is, letters_all_generic, list_single, string_is } from "./common.mjs";

export function compile(parsed) {
    return compile_function(parsed);
}

function compile_function(parsed) {
    assert(parsed.type === 'function');
    assert(identifier_is(parsed.name));

    let vars_dot = "vars.";
    return `
async function ${parsed.name}(vars) {
    ${parsed.variables.length ? "let" : ""} ${parsed.variables.map(v => v.name).join(", ")};
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

export async function load(file_get) {
    let files = [
        'add', 
        'number_1', 
        'number_2', 
        'number_3', 
        "ui_main",
        "ui_element_text",
        "ui_element",
        "ui_element_style",
        "ui_element_on_click",
        "ui_element_width_full",
        "ui_button",
        "property_set",
        "property_get",
        "print"
    ];
    let parseds = [];
    for (let f of files) {
        let parsed = await file_get(f);
        parseds.push(parsed);
        let compiled = compile(parsed);
        console.log(compiled);
        eval_global(compiled);
    }
    for (let parsed of parseds) {
        for (let test of parsed.tests) {
            assert(test.type === 'test');
            let test_vars = {};
            for (let name in test.inputs) {
                let input = test.inputs[name];
                assert(input.type === 'test_variable');
                assert(identifier_is(input.name));
                let value_get = eval_global(input.name);
                let input_vars = {};
                value_get(input_vars);
                test_vars[name] = input_vars[list_single(Object.keys(input_vars))];
            }
            let test_function = eval_global(parsed.name);
            await test_function(test_vars);
            for (let name in test.outputs) {
                let output = test.outputs[name];
                assert(output.type === 'test_variable');
                assert(identifier_is(output.name));
                let value_get = eval_global(output.name);
                let output_vars = {};
                value_get(output_vars);
                assert(test_vars[name] === output_vars[list_single(Object.keys(output_vars))]);
            }
        }
    }
}

