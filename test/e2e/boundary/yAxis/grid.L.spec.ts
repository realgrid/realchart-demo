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
declare global {
  var loadChart: (newConfig: any) => Promise<void>;
}
/** @TODO: 코드테스트 추가 */
const TYPES = ["linear", "category", "time", "log"];

for (let type of TYPES) {
  test.describe(type + "yAxis grid", () => {
    const url = "boundary/empty.html?debug";
    let chart;

    let config: any;

    test.beforeEach(async ({ page }, testInfo) => {
      config = {
        title: "Boundary",
        yAxis: {
          type,
          grid: {},
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
      config.yAxis.grid.visible = true;
      await page.evaluate((newConfig) => {
        chart.load(newConfig, false).render();
      }, config);

      await PWTester.testChartBySnapshot(page, testInfo);
    });

    test("visible false", async ({ page }, testInfo) => {
      config.yAxis.grid.visible = !true;
      await page.evaluate((newConfig) => {
        chart.load(newConfig, false).render();
      }, config);

      await PWTester.testChartBySnapshot(page, testInfo);
    });
  

    // #614 firstVisible, lastVisible 동작하지 않음.

    // #615 log
    // test("belowColor", async ({ page }, testInfo) => {
    //   config.yAxis.grid= {
    //     visible: true,
    //     rows:{
    //         belowColor: "red",
    //     }
    //   };
    //   config.yAxis.baseValue = 2;
    //   await page.evaluate((newConfig) => {
    //     chart.load(newConfig, false).render();
    //   }, config);

    //   await PWTester.testChartBySnapshot(page, testInfo);
    // });

    // #615 log
    // test("colors", async ({ page }, testInfo) => {
    //   config.yAxis.grid= {
    //     visible: true,
    //     rows:{
    //         colors:['red', 'orange', 'yellow', 'green']
    //     }
    //   };
    //   await page.evaluate((newConfig) => {
    //     chart.load(newConfig, false).render();
    //   }, config);

    //   await PWTester.testChartBySnapshot(page, testInfo);
    // });


    
  });
}
