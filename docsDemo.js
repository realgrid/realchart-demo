/**
 * README
 * https://github.com/realgrid/realreport-chart/wiki/TEST-%EA%B0%80%EC%9D%B4%EB%93%9C
 */
import { chromium } from '@playwright/test';
import {
    existsSync,
    mkdirSync,
    readFileSync,
    rmdirSync,
    copyFileSync,
    writeFileSync,
} from 'fs';
// import fs from 'fs/promises';
// import beautify from 'js-beautify';
import util from 'util';

function readFile(file) {
    return readFileSync(file, 'utf-8');
}

function createMetaJson() {
    const list = JSON.parse(readFile('./web/realchart/demos.json'));
    let categories = {};
    const map = new Map(Object.entries(list));
    map.forEach((value, key) => {
        categories[key.replace(' ', '')] = { title: key };
        const map2 = new Map(Object.entries(value));
        let demos = {};
        map2.forEach((value2, key2) => {
            // console.log(`${key}: ${value}`);
            demos[value2] = { title: key2, theme: { toc: false } };
        });
        writeFileSync(
            `./docs/pages/demo/${key.replace(' ', '')}/_meta.json`,
            JSON.stringify(demos, null, '\t')
        );
    });
    writeFileSync(
        `./docs/pages/demo/_meta.json`,
        JSON.stringify(categories, null, '\t')
    );
}

(async () => {
    // if (existsSync('./docs/public/realchart')) {
    //     rmdirSync('./docs/public/realchart', { recursive: true });
    // }
    mkdirSync('./docs/public/realchart', { recursive: true });
    copyFileSync(
        './web/realchart/lib/realchart-lic.js',
        './docs/public/realchart/realchart-lic.js'
    );

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
            mkdirSync(target, { recursive: true });
            console.log(`${target} 해당 경로에 폴더가 없어 생성되었습니다.`);
        }

        if (typeof value !== 'object') continue;
        for (const [key2, value2] of Object.entries(value)) {
            try {
                const url = baseUrl + category + value2 + '.html';
                const res = await page.goto(url);
                if (res.status() != 200) throw Error(`Not found page. ${url}`);
            } catch (err) {
                console.error(`\x1b[31m ${err.message}`);
                continue;
            }

            // evaluate 함수 내부 로그 확인
            // page.on('console', (msg) => console.log(msg));

            // callback 함수를 문자열로 변환하지 않을 경우 undefined로 반환됨
            const { config, tool, callbacks } = await page.evaluate(() => {
                let callbacks = [];
                function functionToStirng(obj) {
                    for (const key in obj) {
                        if (obj[key] instanceof Array) {
                            for (const o of obj[key]) {
                                if (o && typeof o === 'object') {
                                    Object.assign(o, functionToStirng(o));
                                }
                            }
                        } else if (
                            typeof obj[key] === 'object' &&
                            obj[key] !== null
                        ) {
                            obj[key] = functionToStirng(obj[key]);
                        } else {
                            const type = typeof obj[key];
                            if (type === 'function') {
                                obj[key] = obj[key]
                                    .toString()
                                    .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '') // 주석제거
                                    .replace(/[\r\n\t]/g, '') // 이스케이프 문자 제거
                                    .replace(/\s{2,}/g, ' '); // 공백 최소화
                                callbacks.push(obj[key]);
                            }
                        }
                    }
                    return obj;
                }

                return {
                    config: functionToStirng(config),
                    tool: typeof tool !== 'undefined' && functionToStirng(tool),
                    callbacks,
                };
            });

            // 문자로 변환한 callback 함수 복원
            const restoreFunctions = (obj) => {
                for (const key in obj) {
                    if (
                        typeof obj[key] === 'string' &&
                        (obj[key].startsWith('function') ||
                            obj[key].includes('=>'))
                    ) {
                        console.log(new Function(`return ${obj[key]}`));
                        obj[key] = new Function(`return ${obj[key]}`);
                    } else if (
                        typeof obj[key] === 'object' &&
                        obj[key] !== null
                    ) {
                        obj[key] = restoreFunctions(obj[key]);
                    }
                }

                return obj;
            };

            const inspectConf = (conf) => {
                return util.inspect(conf, {
                    showHidden: false,
                    depth: null,
                    maxArrayLength: null,
                });
            };

            /**
             * function 문자열 제거
             */
            const escapeFunc = (conf) => {
                return callbacks.reduce((agg, callback) => {
                    const index = agg.indexOf(callback);
                    if (index > 0) {
                        agg =
                            agg.slice(0, index - 1) +
                            agg.slice(index, index + callback.length) +
                            agg.slice(index + callback.length + 1);
                    }
                    return agg;
                }, conf);
            };

            const parseConfigToString = (conf) => {
                let str = inspectConf(conf);
                return escapeFunc(str);
            };

            const configString = parseConfigToString(config);
            const toolString = parseConfigToString(tool);

            writeFileSync(
                './docs/templates/' + value2 + '.js',
                `export const config = ${configString}\n` +
                    `export const tool = ${toolString}`
            );
            ++count;
            console.log(count, `./docs/templates/${value2}.js`);

            writeFileSync(
                target + '/' + value2 + '.mdx',
                `---
title: "${key2}"
---
import { RealChartReact } from "@/components/RealChart/RealChartReact";
import { tool } from "@/templates/${value2}";

# ${key2}
			
<RealChartReact configString="${encodeURI(
                    configString
                )}" tool={tool} showEditor={true} autoUpdate={false}/>
`
            );
            ++count;
            console.log(count, `${target}/${value2}.mdx`);
        }
    }
    console.log(`총 ${count}개의 mdx파일을 생성했습니다.`);
    try {
        createMetaJson();
        console.log('_meta.json 파일 생성에 성공했습니다.');
    } catch (e) {
        console.error(`_meta.json 파일 생성에 실패했습니다.
		${e}`);
    }
    process.exit();
})();
