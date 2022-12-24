import { assert, file_json_open, identifier_is } from "./common.mjs";
import { compile } from "./compile.mjs";

let files = ['add', 'number_1', , 'number_2', , 'number_3'];
let parseds = [];
for (let f of files) {
    let parsed = await file_json_open(`./src/${f}.json`);
    parseds.push(parsed);
    let compiled = compile(parsed);
    eval(compiled);
}

for (let parsed of parseds) {
    for (let test of parsed.tests) {
        assert(test.type === 'test');
        let vars = {};
        for (let name in test.inputs) {
            let input = test.inputs[name];
            assert(input.type === 'test_variable');
            assert(identifier_is(input.name));
            let value_get = eval(input.name)
            vars[name] = value_get();
        }
    }
}