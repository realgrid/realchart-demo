"use strict";
exports.__esModule = true;
var typedoc_nextra_1 = require("typedoc-nextra");
(0, typedoc_nextra_1.createDocumentation)({
    // use existing typedoc json output (leave it blank to auto generate)
    jsonInputPath: "".concat(__dirname, "/.tdout/out.json"),
    // output location
    output: "".concat(__dirname, "/pages"),
    // output markdown
    markdown: true
});
