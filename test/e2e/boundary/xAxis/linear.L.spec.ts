////////////////////////////////////////////////////////////////////////////////
// category.L.spec.ts
// 2023. 12. 14. created by dltlghkd930217
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
test.describe("xAxis, linear test", () => {
  const url = "boundary/empty.html?debug";

  let chart;

  let config: any;

  test.beforeEach(async ({ page }) => {
    config = {
      title: "Boundary",
      xAxis: {
        type: "linear",
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
    await PWTester.goto(page, url);
  });

  test("init", async ({ page }, testInfo) => {
    const container = await page.$("#realchart");
    expect(container).exist;
    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });

  test("tick", async ({ page }, testInfo) => {
    config.xAxis.type = "category";
    config.xAxis.categories = [];
    config.xAxis.tick = {
      visible: true,
    };
    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);
    await PWTester.testChartBySnapshot(page, testInfo);
  });
});
