"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql_grammar = void 0;
exports.sql_grammar = `
SQL {
	Exp = Query ";"

	Query = Partial_query Limit_statement --limited
		  | Partial_query
	Partial_query = Select_statement From_statement Where_statement

	// // Ex.: LIMIT 400
	Limit_statement = "LIMIT" num

	// Where some comparison or sequence of comparisons are all true
	Where_statement = "WHERE" Comp_seq

	// Exs.: col_name < 20 AND other_name = 'name'
	//      (col_name = 'hi' OR other_name = 'what') AND name='where'
	Comp_seq = Comp_seq "AND" Comp_seq --and
			 | Comp_seq "OR" Comp_seq --or
			 | "(" Comp_seq ")" --paren
			 | comp
				
	// Exs.: col_name < 20
	//		col_name != 'Hello world'
	comp = equality_comp --equality
		 | size_comp --size
	equality_comp = column_name space equality_operator space str --string
				  | column_name space equality_operator space num --num
				  | column_name space equality_operator space column_name --col
	equality_operator = "=" --equal_to
					  | "!=" --not_equal_to

	size_comp = column_name space comp_operator space num --num
			  | column_name space comp_operator space column_name --col
	comp_operator = "<" --less_than
				  | ">" --greater_than

	// ex.: FROM table_name
	// (the table name doesn't actually do anything, because we'll always just use the inputted table)
	From_statement = "FROM" table_name
	table_name = column_name

	// ex.: SELECT col_name col_name,col_name,...
	Select_statement = "SELECT" Cols
	Cols = "*" --star
		 | column_name "," Cols -- multiple
		 | column_name

	// some column name (assuming column names can only contain letters, digits, and underscores)
	column_name = column_char+
	column_char = letter 
				| digit
				| "_"

	// any sequence of characters, enclosed by single quotes
	str = "'" (~"'" any)* "'"

	// number of any size/length
	num = digit+
}`;
