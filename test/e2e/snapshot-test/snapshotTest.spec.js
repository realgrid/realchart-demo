import { chromium, test, expect } from '@playwright/test';
import { existsSync, readFileSync, readdirSync } from 'fs';

function readFile(file) {
    return readFileSync(file, "utf-8");
}

const snapshotTestPage = 'http://localhost:6010/snapshot.html?debug';

const ingnoreList = ['gauge-clock.js', 'gauge-clock-multi.js'];

test('snapshot-test', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const root = './docs/templates/';
    const demos = readdirSync(root);

    await page.goto(snapshotTestPage);

    for (let i = 0; i < demos.length; i++) {
        if (ingnoreList.includes(demos[i])) continue;
        const config = readFile(root + demos[i]).replace('export const config = ', '');
        
        await page.evaluate(`chart.load(${config}, false)`);

        const snapshot = await page.locator('#realchart').screenshot();
        await expect(snapshot).toMatchSnapshot(demos[i].replace('.js', '.png'));
    }
});
