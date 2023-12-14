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
/**
 * PlayWright Tests for area.html
 */

test.describe("xAxis, category test", () => {
  const url = "boundary/empty.html?debug";

  let chart;

  let config = {
    title: "Boundary",
    xAxis: {
      categories: [],
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

  test("init", async ({ page }) => {
    const container = await page.$("#realchart");
    expect(container).exist;

    await page.evaluate((newConfig) => {
      chart.load(newConfig, false);
    }, config);
    const xAxis = await PWTester.getAxis(page, "x");
    const labels = await xAxis.$$(".rct-axis-label");

    const labelTexts = await page.evaluate((labels) => {
      return labels.map((e) => Number(e.textContent));
    }, labels);

    const expectTexts = config.series[0].data.map((e, i) => i);

    expect(labelTexts).is.deep.equal(expectTexts);
  });

  test("add categories", async ({ page }) => {
    config.xAxis.categories = ["a", "b", "c", "d", "e"];
    await page.evaluate((newConfig) => {
      chart.load(newConfig, false);
    }, config);
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
