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
declare global{
  var loadChart : (newConfig: any) => Promise<void>
}
/** @TODO: 코드테스트 추가 */
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
      return loadChart(newConfig);
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });


  /**
   * "" 테스트
   */
  // test.describe("", () => {
  //   const url = "boundary/empty.html?debug";

  //   let chart;

  //   let config: any = {
  //     title: "Boundary",
  //     xAxis: {
  //       type: "time",
  //       title: {
  //         visible: true,
  //       },
  //     },
  //     series: [
  //       {
  //         name: "column1",
  //         data: [1, 2, 3, 4],
  //       },
  //     ],
  //   };

  //   test.beforeEach(async ({ page }, testInfo) => {
  //     await PWTester.goto(page, url);
  //   });

  //   test("", async ({ page }, testInfo) => {});
  // });
});
