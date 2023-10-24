import { chromium } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import fs from 'fs/promises';
import util from 'util';

function readFile(file) {
    return readFileSync(file, "utf-8");
}

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const baseUrl = 'http://localhost:6010/realchart/';
	const targetUrl = './docs/pages/';
    const categori = 'demo/';

    const info = JSON.parse(readFile('./web/realchart/demos.json'));

    let count = 0;
    for (const [key, value] of Object.entries(info)) {
		const target = targetUrl + categori + key.replace(/ /g, '');
        if (!existsSync(target)) {
            mkdirSync(target, { recursive: true })
            console.log(`${target} 해당 경로에 폴더가 없어 생성되었습니다.`)
        };

        if (typeof value !== 'object') continue;
        for (const [key2, value2] of Object.entries(value)) {
            await page.goto(baseUrl + categori + value2 + '.html');
            const config = await page.evaluate('config');
			await fs.writeFile('./docs/templates/' + value2 + '.js', `export const config = ${util.inspect(config, { depth: null, maxArrayLength: null })}
`);
            console.log(`./docs/templates/${value2}.js 파일을 생성했습니다.`);
            count++;
			await fs.writeFile(target + '/' + value2 + '.mdx', `---
title: "${key2}"
---
import { RealChartReact } from "@/components/RealChart/RealChartReact";
import { config } from "@/templates/${value2}";

# ${key2}
			
<RealChartReact config={config} showEditor={true} autoUpdate={false} />
`)
            console.log(`${target}/${value2}.mdx 파일을 생성했습니다.`);
            count++;
        };
    };

    console.log(`총 ${count}개의 파일을 생성했습니다.`)
    process.exit();
})();
