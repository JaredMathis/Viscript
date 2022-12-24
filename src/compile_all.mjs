import { file_json_open } from "./common.mjs";
import { load } from "./compile.mjs";

await load(f => file_json_open(`./src/${f}.json`));
