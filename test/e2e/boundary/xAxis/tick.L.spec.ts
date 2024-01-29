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
    test.describe( type + "xAxis tick", () => {
      const url = "boundary/empty.html?debug";
      let chart;
  
      let config: any = {
        title: "Boundary",
        xAxis: {
          type,
          tick: {}
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
  
      test("visible", async ({ page }, testInfo) => {

        config.xAxis.tick.visible = true;

        await page.evaluate((newConfig) => {
          chart.load(newConfig, false);
        }, config);
        await PWTester.sleep(500);

        await PWTester.testChartBySnapshot(page, testInfo);
      });

      test("positive gap", async ({ page }, testInfo) => {

        config.xAxis.tick.visible = true;
        config.xAxis.tick.gap = 100;

        await page.evaluate((newConfig) => {
          chart.load(newConfig, false);
        }, config);
        await PWTester.sleep(500);
  
        await PWTester.testChartBySnapshot(page, testInfo);
      });

      test("negative gap", async ({ page }, testInfo) => {

        config.xAxis.tick.visible = true;
        config.xAxis.tick.gap = -100;

        await page.evaluate((newConfig) => {
          chart.load(newConfig, false);
        }, config);
        await PWTester.sleep(500);
  
        await PWTester.testChartBySnapshot(page, testInfo);
      });

      test("positive length", async ({ page }, testInfo) => {

        config.xAxis.tick.visible = true;
        config.xAxis.tick.length = 100;

        await page.evaluate((newConfig) => {
          chart.load(newConfig, false);
        }, config);
        await PWTester.sleep(500);
  
        await PWTester.testChartBySnapshot(page, testInfo);
      });
      test("negative length", async ({ page }, testInfo) => {

        config.xAxis.tick.visible = true;
        config.xAxis.tick.length = -100;

        await page.evaluate((newConfig) => {
          chart.load(newConfig, false);
        }, config);
        await PWTester.sleep(500);
  
        await PWTester.testChartBySnapshot(page, testInfo);
      });

    });
  }
  