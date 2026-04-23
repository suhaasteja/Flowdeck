/* @ts-self-types="./wasm_fk.d.ts" */
import * as wasm from "./wasm_fk_bg.wasm";
import { __wbg_set_wasm } from "./wasm_fk_bg.js";

__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
export {
    compute_tcp
} from "./wasm_fk_bg.js";
