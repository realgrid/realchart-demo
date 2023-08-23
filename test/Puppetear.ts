////////////////////////////////////////////////////////////////////////////////
// PPTester.ts
// 22020. 08. 23. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2020 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import puppeteer, { Browser, Page } from 'puppeteer';

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
    static async init(): Promise<Browser> {
        return await puppeteer.launch(this.OPTIONS);
    }

    static async newPage(browser: Browser, url: string): Promise<Page> {
        const page = await browser.newPage();

        await page.setViewport(this.VIEWPORT_SIZE);
        await page.goto(url)
        return page;
    }
}
