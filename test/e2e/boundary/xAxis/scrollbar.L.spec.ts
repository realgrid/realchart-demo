import { Globals } from "./../../../../src/globals";
////////////////////////////////////////////////////////////////////////////////
// time.L.spec.ts
// 2024. 01. 29. created by dltlghkd930217
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from "@playwright/test";
import { expect } from "chai";
import { PWTester } from "../../PWTester";
/** @TODO: 코드테스트 추가 */
declare global {
  var loadChart: (newConfig: any) => Promise<void>;
}
/**
 * TITLE 테스트
 */
const TYPES = ["linear", "category", "time", "log"];

for (let type of TYPES) {
  test.describe(type + "xAxis scrollbar", () => {
    const url = "boundary/empty.html?debug";
    let chart;

    let config: any;

    test.beforeEach(async ({ page }, testInfo) => {
      config = {
        title: "Boundary",
        xAxis: {
          type,
          scrollBar: {},
        },
        series: [
          {
            name: "column1",
            data: [1, 2, 3, 4],
          },
        ],
      };
      await PWTester.goto(page, url);
    });

    test("visible", async ({ page }, testInfo) => {
      config.xAxis.scrollBar.visible = true;

      await page.evaluate((newConfig) => {
        chart.load(newConfig, false).render();
      }, config);
      await PWTester.testChartBySnapshot(page, testInfo);
    });

    test("positive gap", async ({ page }, testInfo) => {
      config.xAxis.scrollBar.visible = true;
      config.xAxis.scrollBar.gap = 100;

      await page.evaluate((newConfig) => {
        chart.load(newConfig, false).render();
      }, config);

      await PWTester.testChartBySnapshot(page, testInfo);
    });

    test("negative gap", async ({ page }, testInfo) => {
      config.xAxis.scrollBar.visible = true;
      config.xAxis.scrollBar.gap = -100;

      await page.evaluate((newConfig) => {
        chart.load(newConfig, false).render();
      }, config);
      await PWTester.testChartBySnapshot(page, testInfo);
    });

    test("positive gapFar", async ({ page }, testInfo) => {
      config.xAxis.scrollBar = {
        visible: true,
        gapFar: 100,
      };
      await page.evaluate((newConfig) => {
        chart.load(newConfig, false).render();
      }, config);

      await PWTester.testChartBySnapshot(page, testInfo);
    });

    test("negative gapFar", async ({ page }, testInfo) => {
      config.xAxis.scrollBar = {
        visible: true,
        gapFar: -100,
      };
      await page.evaluate((newConfig) => {
        chart.load(newConfig, false).render();
      }, config);
      await PWTester.testChartBySnapshot(page, testInfo);
    });

    test("thickness", async ({ page }, testInfo) => {
      config.xAxis.scrollBar = {
        visible: true,
        thickness: 50,
      };
      await page.evaluate((newConfig) => {
        chart.load(newConfig, false).render();
      }, config);

      await PWTester.testChartBySnapshot(page, testInfo);
    });

    // minThumbSize ??
  });
}
