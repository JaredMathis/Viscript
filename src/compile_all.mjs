import { assert, eval_global, file_json_open, identifier_is } from "./common.mjs";
import { compile } from "./compile.mjs";

let files = ['add', 'number_1', 'number_2', 'number_3'];
let parseds = [];
for (let f of files) {
    let parsed = await file_json_open(`./src/${f}.json`);
    parseds.push(parsed);
    let compiled = compile(parsed);
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
            test_vars[name] = value_get(input_vars);
        }
    }
}