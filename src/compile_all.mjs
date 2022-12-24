import { file_json_open } from "./common.mjs";
import { compile } from "./compile.mjs";

let parsed = await file_json_open('./src/add.json')
compile(parsed);