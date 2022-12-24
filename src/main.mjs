import { load } from "./compile.mjs";

await load(f => fetch(f + '.json').then(response => response.json()))