import * as ohm from "ohm-js";
import * as readline from "readline";
import {sql_grammar} from "./grammar";
import {sqlSemantics} from "./semantics";
import {readFileSync} from "fs";
import {test_sql} from "./tests";

function queryTable(table: Object[], query: string): Object[] | undefined {
	const sql = ohm.grammar(sql_grammar);

	const semantics = sql.createSemantics();
	semantics.addOperation("eval", sqlSemantics);

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
		console.log(
			"please provide the path to a json file when running this program"
		);
		return;
	}

	const json_path = process.argv[2];
	let data;
	try {
		const file_data = readFileSync(json_path, "utf8");
		data = JSON.parse(file_data);
	} catch (err) {
		console.error(
			"Error reading provided file. Please provide a valid path to a json file"
		);
		return;
	}

	console.log(
		"Please provide a query in the format: SELECT (comma separated list of cols or *) FROM table WHERE (conditions) LIMIT (integer);"
	);
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
		if (res) console.log(res);
	});
}

main();
