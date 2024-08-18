"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlSemantics = void 0;
exports.sqlSemantics = {
    Exp(query, _) {
        return query.eval();
    },
    Query(partial_query) {
        const query_func = partial_query.eval();
        return (table) => {
            return query_func(table);
        };
    },
    // extension of partial query, includes limit statement
    Query_limited(partial_query, limit_statement) {
        const query_func = partial_query.eval();
        const limit = limit_statement.eval();
        return (table) => {
            return query_func(table, limit);
        };
    },
    // complete query w/o the optional limit statement
    Partial_query(select_statement, from_statement, where_statement) {
        const select_res = select_statement.eval();
        const from_res = from_statement.eval();
        const where_res = where_statement.eval();
        return (table, limit) => {
            let remaining = limit;
            const res = table.filter((row) => {
                if (remaining === 0)
                    return false;
                const include = where_res(row);
                if (include)
                    remaining--;
                return include;
            });
            if (select_res[0] === "*")
                return res;
            else {
                return res.map((row) => {
                    const res_row = {};
                    select_res.forEach((key) => {
                        res_row[key] = row[key];
                    });
                    return res_row;
                });
            }
        };
    },
    // limit operator (i.e. LIMIT 100)
    Limit_statement(_, num) {
        return num.eval();
    },
    // where operator (i.e. WHERE i > 2 AND z = '3')
    Where_statement(_, comp_seq) {
        return comp_seq.eval();
    },
    Comp_seq_and(comp_node_1, _, comp_node_2) {
        return (row) => {
            const f1 = comp_node_1.eval();
            const f2 = comp_node_2.eval();
            return f1(row) && f2(row);
        };
    },
    Comp_seq_or(comp_node_1, _, comp_node_2) {
        return (row) => {
            const f1 = comp_node_1.eval();
            const f2 = comp_node_2.eval();
            return f1(row) || f2(row);
        };
    },
    Comp_seq_paren(_open, comp_node, _close) {
        return comp_node.eval();
    },
    equality_comp_col(name_node, _space1, op_node, _space2, name_node_2) {
        const name = name_node.eval();
        const operator = op_node.eval();
        const name_2 = name_node_2.eval();
        return (row) => {
            if (!(name in row))
                throw new Error(`tried to access non-existent row: ${name}`);
            const val = row[name];
            const val_2 = row[name_2];
            if (operator === "=")
                return val === val_2;
            else
                return val !== val_2;
        };
    },
    equality_comp_string(name_node, _space1, op_node, _space2, num_node) {
        const name = name_node.eval();
        const operator = op_node.eval();
        const str = num_node.eval();
        return (row) => {
            if (!(name in row))
                throw new Error(`tried to access non-existent row: ${name}`);
            const val = row[name];
            if (operator === "=")
                return val === str;
            else
                return val !== str;
        };
    },
    equality_comp_num(name_node, _space1, op_node, _space2, num_node) {
        const name = name_node.eval();
        const operator = op_node.eval();
        const num = num_node.eval();
        return (row) => {
            if (!(name in row))
                throw new Error(`tried to access non-existent row: ${name}`);
            const val = row[name];
            if (operator === "=")
                return val === num;
            else
                return val !== num;
        };
    },
    equality_operator(comparator) {
        return comparator.sourceString;
    },
    size_comp_col(name_node, _space1, op_node, _space2, name_node_2) {
        const name = name_node.eval();
        const operator = op_node.eval();
        const name_2 = name_node_2.eval();
        return (row) => {
            if (!(name in row))
                throw new Error(`tried to access non-existent row: ${name}`);
            const val = row[name];
            const val_2 = row[name_2];
            if (typeof val !== "number" || typeof val_2 !== "number") {
                throw new Error("you cannot perform a comparison operation on a non-number: ");
            }
            if (operator === "<")
                return val < val_2;
            else
                return val > val_2;
        };
    },
    size_comp_num(name_node, _space1, op_node, _space2, num_node) {
        const name = name_node.eval();
        const operator = op_node.eval();
        const num = num_node.eval();
        return (row) => {
            if (!(name in row))
                throw new Error(`tried to access non-existent row: ${name}`);
            const val = row[name];
            if (typeof val !== "number") {
                throw new Error("you cannot perform a comparison operation on a non-number: ");
            }
            if (operator === "<")
                return val < num;
            else
                return val > num;
        };
    },
    comp_operator(comparator) {
        return comparator.sourceString;
    },
    // from selector (i.e. FROM table)
    From_statement(_, table) {
        return table.sourceString;
    },
    // column selector (i.e. SELECT col)
    Select_statement(_, cols) {
        return cols.eval();
    },
    Cols_star(_) {
        return "*";
    },
    Cols_multiple(col, _, cols) {
        const res = cols.eval();
        let following_cols;
        if (Array.isArray(res))
            following_cols = res;
        else
            following_cols = [res];
        following_cols.unshift(col.sourceString);
        return following_cols;
    },
    Cols(col) {
        const res = col.eval();
        if (Array.isArray(res))
            return res;
        else
            return [res];
    },
    column_name(chars) {
        return chars.sourceString;
    },
    column_char(char) {
        return char.sourceString;
    },
    // primitives
    str(_, chars, __) {
        return chars.sourceString;
    },
    num(digits) {
        return parseInt(digits.sourceString);
    },
};
