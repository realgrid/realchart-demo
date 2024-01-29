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
declare global{
  var loadChart : (newConfig: any) => Promise<void>
}
test.describe("xAxis, category test", () => {
  const url = "boundary/empty.html?debug";

  let chart;

  let config: any = {
    title: "Boundary",
    xAxis: {
      categories: [],
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

  test.beforeEach(async ({ page }) => {
    await PWTester.goto(page, url);
  });

  test("init", async ({ page }, testInfo) => {
    const container = await page.$("#realchart");
    expect(container).exist;

    await page.evaluate((newConfig) => {
      return loadChart(newConfig);
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
    const xAxis = await PWTester.getAxis(page, "x");
    const labels = await xAxis.$$(".rct-axis-label");

    const labelTexts = await page.evaluate((labels) => {
      return labels.map((e) => Number(e.textContent));
    }, labels);

    const expectTexts = config.series[0].data.map((e, i) => i);

    expect(labelTexts).is.deep.equal(expectTexts);
  });

  test("add categories", async ({ page }, testInfo) => {
    config.xAxis.categories = ["a", "b", "c", "d", "e"];
    await page.evaluate((newConfig) => {
      return loadChart(newConfig);
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
    const xAxis = await PWTester.getAxis(page, "x");
    const labels = await xAxis.$$(".rct-axis-label");

    const labelTexts = await page.evaluate((labels) => {
      return labels.map((e) => e.textContent);
    }, labels);

    const expectTexts = config.series[0].data.map(
      (e, i) => i < config.xAxis.categories.length && config.xAxis.categories[i]
    );

    expect(labelTexts).is.deep.equal(expectTexts);
  });

});
