////////////////////////////////////////////////////////////////////////////////
// category.L.spec.ts
// 2024. 01. 29. created by dltlghkd930217
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from "@playwright/test";
import { expect } from "chai";
import { PWTester } from "../PWTester";
/**
 * PlayWright Tests for area.html
 */

test.describe("empty", () => {
  const url = "boundary/empty.html?debug";

  let chart;

  let config: any = {
    title: "Boundary",
    xAxis: {

    },
    series: [

    ],
  };


  test.beforeEach(async ({ page }) => {
    await PWTester.goto(page, url);

    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);
  });

  test("empty config", async ({ page }, testInfo) => {
    const container = await page.$("#realchart");
    expect(container).exist;

    await PWTester.testChartBySnapshot(page, testInfo);
  });

});
