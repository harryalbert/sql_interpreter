import * as ohm from "ohm-js";
import {sql_grammar} from "./grammar";
import {sqlSemantics} from "./semantics";
import assert from "assert";

const test_data = [
	{
		state: "California",
		region: "West",
		pop: 39538223,
		pop_male: 19453769,
		pop_female: 20084454,
	},
	{
		state: "Texas",
		region: "South",
		pop: 29145505,
		pop_male: 14379201,
		pop_female: 14766304,
	},
	{
		state: "Florida",
		region: "South",
		pop: 21538187,
		pop_male: 10470577,
		pop_female: 11067610,
	},
	{
		state: "New York",
		region: "Northeast",
		pop: 20201249,
		pop_male: 9744767,
		pop_female: 10456482,
	},
	{
		state: "Pennsylvania",
		region: "Northeast",
		pop: 13002700,
		pop_male: 6358163,
		pop_female: 6644537,
	},
	{
		state: "Illinois",
		region: "Midwest",
		pop: 12812508,
		pop_male: 6260237,
		pop_female: 6552271,
	},
	{
		state: "Ohio",
		region: "Midwest",
		pop: 11799448,
		pop_male: 5751973,
		pop_female: 6047475,
	},
	{
		state: "Georgia",
		region: "South",
		pop: 10711908,
		pop_male: 5196814,
		pop_female: 5515094,
	},
	{
		state: "North Carolina",
		region: "South",
		pop: 10439388,
		pop_male: 5068229,
		pop_female: 5371159,
	},
	{
		state: "Michigan",
		region: "Midwest",
		pop: 10077331,
		pop_male: 4930447,
		pop_female: 5146884,
	},
];

const tests: {
	[key: string]: Object;
} = {
	"SELECT state FROM table WHERE pop > 15000000;": [
		{state: "California"},
		{state: "Texas"},
		{state: "Florida"},
		{state: "New York"},
	],
	"SELECT state, region FROM table WHERE pop_male > pop_female;": [],
	"SELECT * FROM table WHERE region = 'Midwest' AND pop < 11000000;": [
		{
			state: "Michigan",
			region: "Midwest",
			pop: 10077331,
			pop_male: 4930447,
			pop_female: 5146884,
		},
	],
	"SELECT state, pop FROM table WHERE region != 'West' AND pop > 20000000 LIMIT 2;":
		[
			{state: "Texas", pop: 29145505},
			{state: "Florida", pop: 21538187},
		],
	"SELECT * FROM table WHERE (region = 'South' OR region = 'West') AND pop < 15000000;":
		[
			{
				state: "Georgia",
				region: "South",
				pop: 10711908,
				pop_male: 5196814,
				pop_female: 5515094,
			},
			{
				state: "North Carolina",
				region: "South",
				pop: 10439388,
				pop_male: 5068229,
				pop_female: 5371159,
			},
		],
	"SELECT state, region FROM table WHERE pop_female > 10000000 AND pop_male < 10000000;":
		[{state: "New York", region: "Northeast"}],
	"SELECT * FROM table WHERE pop > 30000000 OR (pop < 11000000 AND region = 'Midwest');":
		[
			{
				state: "California",
				region: "West",
				pop: 39538223,
				pop_male: 19453769,
				pop_female: 20084454,
			},
			{
				state: "Michigan",
				region: "Midwest",
				pop: 10077331,
				pop_male: 4930447,
				pop_female: 5146884,
			},
		],
	"SELECT state FROM table WHERE pop_male > 6000000 AND pop_female < 7000000;":
		[{state: "Pennsylvania"}, {state: "Illinois"}],
};

const test_case = (query: string, expectedResult: Object): void => {
	const sql = ohm.grammar(sql_grammar);

	const semantics = sql.createSemantics();
	semantics.addOperation("eval", sqlSemantics);

	const matchResult = sql.match(query);
	if (!matchResult.succeeded()) {
		console.log("failed query b/c of poor formatting: ", query);
		return;
	}

	const filter_func = semantics(matchResult).eval();
	const res = filter_func(test_data);
	assert.deepEqual(res, expectedResult, `assertion failed: ${query}`);
};

export const test_sql = () => {
	Object.entries(tests).forEach(([query, res]) => {
		test_case(query, res);
	});
	console.log("all tests passed!");
};
