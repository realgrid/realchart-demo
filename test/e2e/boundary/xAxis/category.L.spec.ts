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
      chart.load(newConfig, false);
    }, config);
    await PWTester.sleep();
    const xAxis = await PWTester.getAxis(page, "x");
    const labels = await xAxis.$$(".rct-axis-label");

    const labelTexts = await page.evaluate((labels) => {
      return labels.map((e) => Number(e.textContent));
    }, labels);

    const expectTexts = config.series[0].data.map((e, i) => i);

    expect(labelTexts).is.deep.equal(expectTexts);
    await PWTester.testChartBySnapshot(page, testInfo);
  });

  test("add categories", async ({ page }, testInfo) => {
    config.xAxis.categories = ["a", "b", "c", "d", "e"];
    await page.evaluate((config) => {
      chart.load(config, false);
    }, config);
    await PWTester.sleep();
    const xAxis = await PWTester.getAxis(page, "x");
    const labels = await xAxis.$$(".rct-axis-label");

    const labelTexts = await page.evaluate((labels) => {
      return labels.map((e) => e.textContent);
    }, labels);

    const expectTexts = config.series[0].data.map(
      (e, i) => i < config.xAxis.categories.length && config.xAxis.categories[i]
    );

    expect(labelTexts).is.deep.equal(expectTexts);
    await PWTester.testChartBySnapshot(page, testInfo);
  });

  test("tick", async ({ page }, testInfo) => {
    const container = await page.$("#realchart");

    config.xAxis.type = "category";
    config.xAxis.categories = [];
    await page.evaluate((newConfig) => {
      newConfig.xAxis.tick = true;
      chart.load(newConfig, false);
    }, config);

    await PWTester.sleep();
    const xAxis = await PWTester.getAxis(page, "x");
    const ticks = await xAxis.$$(".rct-axis-tick");

    expect(ticks.length).is.greaterThan(0);
    expect(ticks.length).is.equal(config.series[0].data.length);

    const points = await page.$$(".rct-point");

    for (let point of points) {
      const bounds = await PWTester.getBounds(point);
      expect(bounds.x).is.greaterThan(0);
      const path = await PWTester.getPathDValue(point);
      expect(Number(path?.split(" ")[1])).is.greaterThan(0);
    }

    await PWTester.testChartBySnapshot(page, testInfo);
  });
});
