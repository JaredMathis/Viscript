import { assert, eval_global, file_json_open, identifier_is, list_single } from "./common.mjs";
import { compile } from "./compile.mjs";

let files = ['add', 'number_1', 'number_2', 'number_3', "ui_main"];
let parseds = [];
for (let f of files) {
    let parsed = await file_json_open(`./src/${f}.json`);
    parseds.push(parsed);
    let compiled = compile(parsed);
    console.log(compiled)
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
            assert(test_vars[name] === output_vars[list_single(Object.keys(output_vars))])
        }
    }
}