This is a paired down version of a full sql interpreter, created using typescript, node.js, and ohm. The dist folder includes executables for mac, windows, and linux, but I've only tested the mac executable (so you might have to recompile yourself).

Running instructions:
first call `path/to/executable path/to/json_file`
Once the program is running, queries can be provided in the form `SELECT (comma separated list of cols or \*) FROM TABLE WHERE (conditions) LIMIT (integer);`

Created by Harry Albert, 2024
