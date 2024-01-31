/**
 * Class Api 문서를 생성한다.
 **/

const fs = require('fs');
const path = require('path');
const typedocNextra = require('./lib/typedoc-nextra');

typedocNextra
    .createDocumentation({
        // use existing typedoc json output (leave it blank to auto generate)
        jsonInputPath: ''.concat(__dirname, '/.tdout/main.json'),
        configInputPath: ''.concat(__dirname, '/.tdout/api.json'),
        // output location
        output: ''.concat(__dirname, '/.tdout/docs'),
        // output markdown
        markdown: true,
    })
    .then((_) => {
        const pages = [
            { type: 'classes', dir: 'classes', title: 'Classes' },
            { type: 'functions', dir: 'globals', title: 'Globals' },
            { type: 'types', dir: 'interfaces', title: 'Interfaces' },
        ];

        pages.forEach(({ type, dir, title }) => {
            const from = path.join(__dirname, `/.tdout/docs/${type}/realchart`);
            const to = path.join(__dirname, `/pages/docs/api/${dir}`);
            !fs.existsSync(to) && fs.mkdirSync(to);

            const meta = {};
            fs.readdir(from, (err, files) => {
                files.forEach((f) => {
                    const [clsName] = f.split('.');
                    meta[clsName] = clsName;
                    fs.rename(path.join(from, f), path.join(to, f), (err) => {
                        err && console.error(err);
                    });
                });

                fs.writeFileSync(
                    path.join(to, '_meta.json'),
                    JSON.stringify(meta, null, 2)
                );
            });
        });
    });
