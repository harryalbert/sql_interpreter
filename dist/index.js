"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ohm = __importStar(require("ohm-js"));
const readline = __importStar(require("readline"));
const grammar_1 = require("./grammar");
const semantics_1 = require("./semantics");
const fs_1 = require("fs");
function queryTable(table, query) {
    const sql = ohm.grammar(grammar_1.sql_grammar);
    const semantics = sql.createSemantics();
    semantics.addOperation("eval", semantics_1.sqlSemantics);
    const matchResult = sql.match(query);
    if (!matchResult.succeeded()) {
        console.log("Error: poorly formatted query");
        return;
    }
    const filter_func = semantics(matchResult).eval();
    return filter_func(table);
}
function main() {
    // Get command-line arguments
    if (process.argv.length < 3) {
        console.log("please provide the path to a json file when running this program");
        return;
    }
    const json_path = process.argv[2];
    let data;
    try {
        const file_data = (0, fs_1.readFileSync)(json_path, "utf8");
        data = JSON.parse(file_data);
    }
    catch (err) {
        console.error("Error reading provided file. Please provide a valid path to a json file");
        return;
    }
    console.log("Please provide a query in the format: SELECT (comma separated list of cols or *) FROM table WHERE (conditions) LIMIT (integer);");
    console.log("(LIMIT is optional)");
    console.log("");
    // Create an interface for reading input from the console
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    // Listen for input from the console
    rl.on("line", (input) => {
        const res = queryTable(data, input);
        if (res)
            console.log(res);
    });
}
main();
