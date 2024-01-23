import { chromium, test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'fs';

function readFile(file) {
    return readFileSync(file, 'utf-8');
}

function getConfig(path) {
    let config = readFile(path).replace('export const config = ', '');
    return config.slice(0, config.indexOf('export const tool'));
}

const snapshotTestPage =
    'http://localhost:6010/realchart/demo/snapshot.html?debug';
const ingnoreList = ['gauge-clock.js', 'gauge-clock-multi.js'];

const demoPath = './docs/templates/';
const demos = readdirSync(demoPath);
const samplePath = './test/e2e/snapshot-test/snapshot-sample/';
const samples = readdirSync(samplePath);
const configs = [];

demos.forEach((demo) => {
    if (ingnoreList.includes(demo)) return;
    configs.push({
        name: demo.replace('.js', ''),
        config: getConfig(demoPath + demo),
    });
});

samples.forEach((sample) => {
    configs.push({
        name: 'sample-' + sample.replace('.js', ''),
        config: getConfig(samplePath + sample),
    });
});

for (let i = 0; i < configs.length; i++) {
    test(configs[i].name + '-test', async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto(snapshotTestPage);

        await page.evaluate(`
        const config = ${configs[i].config};
        chart.load(config, false)`);

        const snapshot = await page.locator('#realchart').screenshot();
        await expect(snapshot).toMatchSnapshot(configs[i].name + '.png', {
            maxDiffPixels: 1,
        });

        await browser.close();
    });
}
