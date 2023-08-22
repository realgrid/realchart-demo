////////////////////////////////////////////////////////////////////////////////
// area-multi.spec.ts
// 2023. 08. 22. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import puppeteer, { Browser } from 'puppeteer';

/**
 * Puppetear Tests for area-multi.html
 */
 describe("area-multi.html test", async function() {

    const opts: any = {    
        headless: "new",    
        slowMo: 100,    
        timeout: 0,    
        args: ['--start-maximized'] 
    }
    let browser: Browser;

    before(async () => {
        browser = await puppeteer.launch(opts);
    });

    after(async () => {
        browser.close();
    });

    it('init', async () => {
        const page = await browser.newPage();
        await page.setViewport({width: 1920, height: 1080});
        await page.goto("http://localhost:6010/realchart/demo/area-multi.html")

        const container = await page.$('#realchart');
        expect(container).exist;

        const markers = await page.$$('.rct-data-point')
        expect(markers.length > 0).is.true;

        const config: any = await page.evaluate('config');
        const data = [];

        for (let i = 0; i < config.series.length; i++) {
            data.push(...config.series[i].data);
        }
        expect(data.length).eq(markers.length);        
    });
});
