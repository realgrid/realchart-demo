////////////////////////////////////////////////////////////////////////////////
// time.L.spec.ts
// 2024. 01. 18. created by dltlghkd930217
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from "@playwright/test";
import { expect } from "chai";
import { PWTester } from "../../PWTester";
/**
 * PlayWright Tests for area.html
 */

  /**
   * TITLE 테스트
   */
  const TYPES = ["linear", "category", "time", "log"];

  for(let type of TYPES){
    test.describe( type + "xAxis title", () => {
      const url = "boundary/empty.html?debug";
      let chart;
  
      let config: any = {
        title: "Boundary",
        xAxis: {
          type,
          title: {
            visible: true,
          },
        },
        series: [
          {
            name: "column1",
            data: [1, 2, 3, 4],
          },
        ],
      };
  
  
      test.beforeEach(async ({ page }, testInfo) => {
        await PWTester.goto(page, url);
      });
  
      test("null title", async ({ page }, testInfo) => {
        config.xAxis.title.text = null;
  
        await page.evaluate((newConfig) => {
          chart.load(newConfig, false);
        }, config);
        await PWTester.sleep(500);
        const xAxis = await PWTester.getAxis(page, "x");
        const title = await xAxis.$$(".rct-axis-title");
  
        const titleText = await page.evaluate((title) => {
          return title[0].textContent;
        }, title);
  
        expect(titleText).is.not.true;
  
        await PWTester.testChartBySnapshot(page, testInfo);
      });
  
      test("special character title", async ({ page }, testInfo) => {
        const character = "😄 ⸝ဗီူ⸜ ･ิĹ̯･ิ (˵¯͒⌄¯͒˵)";
        config.xAxis.title.text = character;
  
        await page.evaluate((newConfig) => {
          chart.load(newConfig, false);
        }, config);
        await PWTester.sleep(500);
        const xAxis = await PWTester.getAxis(page, "x");
        const title = await xAxis.$$(".rct-axis-title");
  
        const titleText = await page.evaluate((title) => {
          return title[0].textContent;
        }, title);
  
        expect(titleText).is.equal(character);
  
        await PWTester.testChartBySnapshot(page, testInfo);
      });
  
      test("min value", async ({ page }, testInfo) => {
        config.xAxis.title.text = "title 22";
        config.xAxis.title.align = "start";
        config.xAxis.title.gap = -100;
        config.xAxis.title.offset = -100;
  
        await page.evaluate((newConfig) => {
          chart.load(newConfig, false);
        }, config);
        await PWTester.sleep(500);
        const xAxis = await PWTester.getAxis(page, "x");
        const title = await xAxis.$$(".rct-axis-title");
  
        const titleText = await page.evaluate((title) => {
          return title[0].textContent;
        }, title);
  
        expect(titleText).is.equal("title 22");
  
        await PWTester.testChartBySnapshot(page, testInfo);
      });
  
      test("title length", async ({ page }, testInfo) => {
        // 최대 길이를 초과하는 타이틀로 설정한 경우의 테스트
        const maxLengthTitle = "x".repeat(500);
        config.xAxis.title.text = maxLengthTitle;
  
        await page.evaluate((newConfig) => {
          chart.load(newConfig, false);
        }, config);
        await PWTester.sleep(500);
        const xAxis = await PWTester.getAxis(page, "x");
        const title = await xAxis.$$(".rct-axis-title");
  
        const titleText = await page.evaluate((title) => {
          return title[0].textContent;
        }, title);
  
        const rect = await page.evaluate((title) => {
          return title[0].getBoundingClientRect();
        }, title);
  
        expect(titleText).is.equal("x".repeat(500));
  
        expect(rect.width).is.greaterThan(850);
  
        await PWTester.testChartBySnapshot(page, testInfo);
      });
  
      test("empty value", async ({ page }, testInfo) => {
        config.xAxis.title.text = null;
  
        await page.evaluate((newConfig) => {
          return chart.load(newConfig, false);
        }, config);
        await PWTester.sleep(500);
        const xAxis = await PWTester.getAxis(page, "x");
        const title = await xAxis.$$(".rct-axis-title");
        const titleText = await page.evaluate((title) => {
          //@ts-ignore
          window.title = title;
          return title[0].textContent;
        }, title);
  
        expect(titleText).is.equal("");
  
        await PWTester.testChartBySnapshot(page, testInfo);
      });
  
      test("align middle", async ({ page }, testInfo) => {
        config.xAxis.title = {
          visible: true,
          text: "TITLE",
          align: "middle",
        };
  
        await page.evaluate((newConfig) => {
          return chart.load(newConfig, false);
        }, config);
  
        await PWTester.sleep(500);
  
        await PWTester.testChartBySnapshot(page, testInfo);
      });
      test("align end", async ({ page }, testInfo) => {
        config.xAxis.title = {
          visible: true,
          text: "TITLE",
        };
  
        // align end
        config.xAxis.title.align = "end";
        await page.evaluate((newConfig) => {
          return chart.load(newConfig, false);
        }, config);
  
        await PWTester.sleep(500);
        await PWTester.testChartBySnapshot(page, testInfo);
      });
  
      test("align start", async ({ page }, testInfo) => {
        config.xAxis.title = {
          visible: true,
          text: "TITLE",
        };
  
        // align start
        config.xAxis.title.align = "start";
        await page.evaluate((newConfig) => {
          return chart.load(newConfig, false);
        }, config);
  
        await PWTester.sleep(500);
        await PWTester.testChartBySnapshot(page, testInfo);
      });
  
      test("positive gap", async ({ page }, testInfo) => {
        config.xAxis.title = {
          visible: true,
          text: "TITLE",
          gap: 100,
        };
        await page.evaluate((newConfig) => {
          return chart.load(newConfig, false);
        }, config);
        await PWTester.sleep(500);
  
        await PWTester.testChartBySnapshot(page, testInfo);
      });
  
      test("negative gap", async ({ page }, testInfo) => {
        config.xAxis.title = {
          visible: true,
          text: "TITLE",
          gap: -100,
        };
        await page.evaluate((newConfig) => {
          return chart.load(newConfig, false);
        }, config);
  
        await PWTester.sleep(500);
  
        await PWTester.testChartBySnapshot(page, testInfo);
      });
    });
  }
  