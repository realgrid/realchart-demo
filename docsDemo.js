import { chromium } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync, rmdirSync, copyFileSync, writeFileSync } from 'fs';
import fs from 'fs/promises';
import util from 'util';

function readFile(file) {
    return readFileSync(file, "utf-8");
}

function createMetaJson() {
    const list = JSON.parse(readFile('./web/realchart/demos.json'));
	let categories = {};
	const map = new Map(Object.entries(list));
	map.forEach((value, key) => {
		categories[key.replace(' ', '')] = {title: key};
		const map2 = new Map(Object.entries(value));
		let demos = {}
		map2.forEach((value2, key2) => {
			// console.log(`${key}: ${value}`);
			demos[value2] = {title: key2};
		});
		writeFileSync(`./docs/pages/demo/${key.replace(' ', '')}/_meta.json`, JSON.stringify(demos, null, '\t'));
	});
	writeFileSync(`./docs/pages/demo/_meta.json`, JSON.stringify(categories, null, '\t'));
}

(async () => {
    if (existsSync('./docs/public/realchart')) {
        rmdirSync('./docs/public/realchart', { recursive: true });
    }
    mkdirSync('./docs/public/realchart', { recursive: true });
    copyFileSync('./web/realchart/lib/realchart-lic.js', './docs/public/realchart/realchart-lic.js');

    if (existsSync('./docs/templates')) {
        rmdirSync('./docs/templates', { recursive: true });
    }

    if (existsSync('./docs/pages/demo')) {
        rmdirSync('./docs/pages/demo', { recursive: true });
    }

    mkdirSync('./docs/templates', { recursive: true });

    const browser = await chromium.launch();
    const page = await browser.newPage();

    const baseUrl = 'http://localhost:6010/realchart/';
	const targetUrl = './docs/pages/';
    const category = 'demo/';

    const info = JSON.parse(readFile('./web/realchart/demos.json'));

    let count = 0;
    for (const [key, value] of Object.entries(info)) {
		const target = targetUrl + category + key.replace(/ /g, '');
        if (!existsSync(target)) {
            mkdirSync(target, { recursive: true })
            console.log(`${target} 해당 경로에 폴더가 없어 생성되었습니다.`)
        };

        if (typeof value !== 'object') continue;
        for (const [key2, value2] of Object.entries(value)) {
            await page.goto(baseUrl + category + value2 + '.html');
            const config = await page.evaluate('config');
			writeFileSync('./docs/templates/' + value2 + '.js', `export const config = ${util.inspect(config, { depth: null, maxArrayLength: null })}
`);
            ++count;
            console.log(count, `./docs/templates/${value2}.js`);
            
			writeFileSync(target + '/' + value2 + '.mdx', `---
title: "${key2}"
---
import { RealChartReact } from "@/components/RealChart/RealChartReact";
import { config } from "@/templates/${value2}";

# ${key2}
			
<RealChartReact config={config} showEditor={true} autoUpdate={false} />
`)
            ++count
            console.log(count, `${target}/${value2}.mdx`);
        };
    };

    console.log(`총 ${count}개의 mdx파일을 생성했습니다.`);
	try {
		createMetaJson();
		console.log('_meta.json 파일 생성에 성공했습니다.')
	} catch(e) {
		console.error(`_meta.json 파일 생성에 실패했습니다.
		${e}`)
	}
    process.exit();
})();
