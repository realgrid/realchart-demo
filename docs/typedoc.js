const typedocNextra = require("typedoc-nextra");

typedocNextra.createDocumentation({
    // use existing typedoc json output (leave it blank to auto generate)
    jsonInputPath: "".concat(__dirname, "/.tdout/out.json"),
    // output location
    output: "".concat(__dirname, "/pages/docs"),
    // output markdown
    markdown: true
})
