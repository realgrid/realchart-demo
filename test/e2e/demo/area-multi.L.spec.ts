import { getCssProp, StyleProps } from './../../../src/common/Types';
////////////////////////////////////////////////////////////////////////////////
// area-multi.L.spec.ts
// 2023. 11. 17. created by dltlghkd930217
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../PWTester';
import { SeriesView } from '../../../src/view/SeriesView';
import { Utils } from '../../../src/common/Utils';
import { SvgShapes } from '../../../src/common/impl/SvgShape';

/**
 * PlayWright Tests for area-multi.html
 */
test.describe('area-multi.html test', () => {
    let chart: any = null, config : any = null;

    const url = 'demo/area-multi.html?debug';

    test.beforeEach(async ({ page }) => {
        await PWTester.goto(page, url);
    });

    test('init', async ({ page }) => {
        const container = await page.$('#realchart');
        expect(container).exist;
        config = await page.evaluate(() => config);
        expect(config.type).is.equal("area");
    });

    // CIRCLE, DIAMON, RECTANGLE, SQUAURE, TRIANGLE, ITRIANGLE, STAR
    test('shape', async ({page}) => {
        const removeSpace = (str: string) => {
            return str.replace(/\s/g,"");
        } 

        const makeString = (arr: Object) => {
            if(Array.isArray(arr)){
                return arr.join().replace(/,/g, "")
            }
            return ;
        }

        // SvgShapes에서 모양을 확인할 수 있다.
