////////////////////////////////////////////////////////////////////////////////
// PPTester.ts
// 22020. 08. 23. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2020 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import * as fs from 'fs';
import puppeteer, { Browser, Page, ElementHandle } from 'puppeteer';
import { IRect } from '../src/common/Rectangle';

/**
 * [주의] 소스 변경 후 yarn dbundle이나 yanr pub으로 번들링한 후 테스트해야 한다.
 */
export class PPTester {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly OPTIONS: any = {
        headless: "new",    
        slowMo: 100,    
        timeout: 0,    
        args: ['--start-maximized'] 
    };
    static readonly VIEWPORT_SIZE = {
        width: 1920,
        height: 1080
    };

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static browser: Browser;

    static async init(launch = false): Promise<Browser> {
        // if (!PPTester.browser || launch) {
            // screenshot folder
            if (!fs.existsSync('out/ss')) {
                fs.mkdirSync('out/ss', { recursive: true });
            }
            // launch browser
            // PPTester.browser = await puppeteer.launch(this.OPTIONS);
            return await puppeteer.launch(this.OPTIONS);
        // }
        // return PPTester.browser;
    }

    static async newPage(browser: Browser, url: string): Promise<Page> {
        const page = await browser.newPage();

        page.on('pageerror', ({ message }) => console.error(message))
            .on('error', ({ message }) => console.error(message))
            .on('console', msg => console.log('>> ' + msg.text()));

        await page.setViewport(this.VIEWPORT_SIZE);
        await page.goto(url).catch(err => '>> ' + console.error(err));
        return page;
    }

    static async getBounds(elt: ElementHandle): Promise<IRect> {
        return await elt.evaluate(elt => {
            const {x, y, width, height} = elt.getBoundingClientRect()
            return {x, y, width, height}
        });
    }
}
