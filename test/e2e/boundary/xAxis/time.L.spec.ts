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

test.describe("xAxis, time test", () => {
  const url = "boundary/empty.html?debug";

  let chart;

  let config: any = {
    title: "Boundary",
    xAxis: {
      type: "time",
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
      return labels.map((e) => e.textContent);
    }, labels);

    const expectTexts = ["00:00", "001", "002", "003"];

    expect(labelTexts).is.deep.equal(expectTexts);
    await PWTester.testChartBySnapshot(page, testInfo);
  });
});
