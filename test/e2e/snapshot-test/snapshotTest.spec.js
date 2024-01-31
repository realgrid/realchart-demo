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
        path: demoPath + demo,
        name: demo.replace('.js', ''),
        config: getConfig(demoPath + demo),
    });
});

samples.forEach((sample) => {
    configs.push({
        path: samplePath + sample,
        name: 'sample-' + sample.replace('.js', ''),
        config: getConfig(samplePath + sample),
    });
});

for (let i = 0; i < configs.length; i++) {
    const path = configs[i].path;
    test(configs[i].name + '-test', async ({}, testInfo) => {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto(snapshotTestPage);

        await page.evaluate(`
        const config = ${configs[i].config};
        chart.load(config, false)`);

        // poll pie예제 imageUrl이미지가 나오기 전 스크린샷을 찍기때문에 아래 코드 추가
        await page.mainFrame().waitForLoadState("networkidle");
        const snapshot = await page.locator('#realchart').screenshot();
        await expect(snapshot, {message: path}).toMatchSnapshot(configs[i].name + '.png', {
            maxDiffPixels: 2,
        });

        await browser.close();
    });

    test('inverted-' + configs[i].name + '-test', async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto(snapshotTestPage);

        await page.evaluate(`
        const config = ${configs[i].config};
        config.inverted = !config.inverted;
        chart.load(config, false)`);

        // poll pie예제 imageUrl이미지가 나오기 전 스크린샷을 찍기때문에 아래 코드 추가
        await page.mainFrame().waitForLoadState("networkidle");
        const snapshot = await page.locator('#realchart').screenshot();
        await expect(snapshot, {message: path}).toMatchSnapshot('inverted-' + configs[i].name + '.png', {
            maxDiffPixels: 2,
        });

        await browser.close();
    });

    test('reversed-' + configs[i].name + '-test', async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto(snapshotTestPage);

        await page.evaluate(`
        const config = ${configs[i].config};
        if (config.xAxis) {
            if (config.xAxis?.length > 1) {
                config.xAxis.forEach((axis) => {
                    axis.reversed = true;
                })
            } else {
                config.xAxis.reversed = true;
            }
        } else {
            config.xAxis = {reversed: true};
        }
        if (config.yAxis) {
            if (config.yAxis?.length > 1) {
                config.yAxis.forEach((axis) => {
                    axis.reversed = true;
                })
            } else {
                config.yAxis.reversed = true;
            }
        } else {
            config.yAxis = {reversed: true};
        }
        chart.load(config, false)`);

        // poll pie예제 imageUrl이미지가 나오기 전 스크린샷을 찍기때문에 아래 코드 추가
        await page.mainFrame().waitForLoadState("networkidle");
        const snapshot = await page.locator('#realchart').screenshot();
        await expect(snapshot, {message: path}).toMatchSnapshot('reversed-' + configs[i].name + '.png', {
            maxDiffPixels: 2,
        });

        await browser.close();
    });

    test('inverted-reversed-' + configs[i].name + '-test', async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto(snapshotTestPage);

        await page.evaluate(`
        const config = ${configs[i].config};
        config.inverted = !config.inverted;
        if (config.xAxis) {
            if (config.xAxis?.length > 1) {
                config.xAxis.forEach((axis) => {
                    axis.reversed = true;
                })
            } else {
                config.xAxis.reversed = true;
            }
        } else {
            config.xAxis = {reversed: true};
        }
        if (config.yAxis) {
            if (config.yAxis?.length > 1) {
                config.yAxis.forEach((axis) => {
                    axis.reversed = true;
                })
            } else {
                config.yAxis.reversed = true;
            }
        } else {
            config.yAxis = {reversed: true};
        }
        chart.load(config, false)`);

        // poll pie예제 imageUrl이미지가 나오기 전 스크린샷을 찍기때문에 아래 코드 추가
        await page.mainFrame().waitForLoadState("networkidle");
        const snapshot = await page.locator('#realchart').screenshot();
        await expect(snapshot, {message: path}).toMatchSnapshot('inverted-reversed-' + configs[i].name + '.png', {
            maxDiffPixels: 2,
        });

        await browser.close();
    });
}
