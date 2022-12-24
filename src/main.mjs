import { load } from "./compile.mjs";

await load(f => fetch(f + '.json').then(response => response.json()))

await ui_main()