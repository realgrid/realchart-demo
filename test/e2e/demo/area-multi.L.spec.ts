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
        const SHAPES = ["circle", "diamond", "rectangle", "square", "triangle", "itriangle", "star"];
        config = await page.evaluate(() => config);


           // 비동기 함수 정의
        const loadShapeAndGetPathValue = async (shape) => {
            await page.evaluate((shape) => {
                config.series.forEach(c => {
                    c.marker = false;
                });

                config.series[0].marker = {
                    visible: true,
                    shape: shape
                };

                chart.load(config, false);
            }, shape);

            const markers = await page.$$("." + SeriesView.POINT_CLASS);
            
            return await PWTester.getPathDValue(markers[0]);
        };

 
        const shape = Utils.arandom(SHAPES)
        const pathValue = await loadShapeAndGetPathValue(shape);

        // 비동기 문제로인하여 아래 코드를 작성하지 않으면, pathValue값이 정상적으로 변경되지않아 테스트가 실패하는 경우가 있다.
        // await new Promise(resolve => setTimeout(resolve, 500));

        // pathValue를 기반으로 테스트 케이스 실행
        switch (shape) {
            case "circle":
                expect(removeSpace(pathValue)).to.equal(makeString(SvgShapes.circle(4, 4, 4)));
                break;
            case "diamond":
                expect(removeSpace(pathValue)).to.equal(makeString(SvgShapes.diamond(0, 0, 8, 8)));
                break;
            case "rectangle":
                expect(removeSpace(pathValue)).to.equal(makeString(SvgShapes.rectangle(0, 0, 8, 8)));
                break;
            case "square":
                expect(removeSpace(pathValue)).to.equal(makeString(SvgShapes.square(0, 0, 8, 8)));
                break;
            case "triangle":
                expect(removeSpace(pathValue)).to.equal(makeString(SvgShapes.triangle(0, 0, 8, 8)));
                break;
            case "itriangle":
                expect(removeSpace(pathValue)).to.equal(makeString(SvgShapes.itriangle(0, 0, 8, 8)));
                break;
            case "star":
                expect(removeSpace(pathValue)).to.equal(makeString(SvgShapes.star(0, 0, 8, 8)));
                break;
        }
    
    });

    test('marker visible',async ({page}) => {
        // series.marker 값 변경에 따른 rct-point 확인
        const getTrueMarkers = (config) => {
            return  config.series.reduce((acc: number, curr: any) => { return curr.marker === true || curr.marker?.visible === true ? acc + 1 : acc}, 0);
        }
        let markers = await page.$$('.'+SeriesView.POINT_CLASS);
        config = await page.evaluate(() => config);

        const dataCount = config.series[0].data.length;
        const seriesCount = config.series.length;

        let trueMarkers = getTrueMarkers(config);
        expect(markers.length).is.equal(trueMarkers * dataCount);


        let randomArr = Utils.iarandom(0, seriesCount, Utils.irandom(1, seriesCount));
        await new Promise(resolve => setTimeout(resolve, 500));
        config = await page.evaluate((randomArr)=>{
            // marker초기화
            config.series.forEach(c => {
                c.marker = false; 
            });

            for(let ran of randomArr){
                config.series[ran].marker = true;
            };

            chart.load(config, false);
            return config;
        }, randomArr);

        trueMarkers = getTrueMarkers(config);

        
        markers = await page.$$('.'+SeriesView.POINT_CLASS);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(trueMarkers)
        expect(markers.length).is.equal(trueMarkers * dataCount);
        

        // visible 속성을 사용하여 visible을 켜고 클 때
        randomArr = Utils.iarandom(0, seriesCount, Utils.irandom(1, seriesCount));

        config = await page.evaluate((randomArr)=>{
            // marker초기화
            config.series.forEach(c => {
                c.marker.visible = false; 
                chart.load(config, false);
            });

            for(let ran of randomArr){
                config.series[ran].marker.visible = true;
            };

            chart.load(config, false);
            return config;
        }, randomArr);

        trueMarkers = getTrueMarkers(config);
        markers = await page.$$('.'+SeriesView.POINT_CLASS);
        expect(markers.length).is.equal(trueMarkers * dataCount);
        
    });

    test("style", async ({ page }) => {
        config = await page.evaluate(() => {
            // marker초기화
            config.series.forEach(c => {
                c.marker = false; 
            });

            config.series[0].marker = {
                visible: true,
                style: {
                    fill: "red"
                }
            };

            chart.load(config, false);
            return config;
        });

        const marker = await page.$$('.'+SeriesView.POINT_CLASS);
        
        const filledColor =  await marker[0].evaluate((marker)=>{
            const style = window.getComputedStyle(marker);
            return style.fill;
        }, marker[0]);

        expect(filledColor).is.equal("rgb(255, 0, 0)");
    });
    // firstVisible, lastVisible, maxVisible, minVisible은 구현이 되어있지 않아 테스트가 불가능.
});
