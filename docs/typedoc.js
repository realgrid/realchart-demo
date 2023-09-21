const fs = require('fs')
const path = require('path')
const typedocNextra = require("typedoc-nextra");

typedocNextra.createDocumentation({
    // use existing typedoc json output (leave it blank to auto generate)
    jsonInputPath: "".concat(__dirname, "/.tdout/main.json"),
    // output location
    output: "".concat(__dirname, "/.tdout/docs"),
    // output markdown
    markdown: true,
}).then(() => {
  // for (const t of ['classes', 'functions']) {
  ['classes', 'functions'].forEach(t => {
    const from = path.join(__dirname, `/.tdout/docs/${t}/realchart`)
    const to = path.join(__dirname, "/pages/docs/")

    fs.readdir(from, ((err, files) => {
      files.forEach(f => {
        fs.rename(path.join(from, f), path.join(to, f), (err)=> { err && console.error(err)});
      });
    }));
  })
});
