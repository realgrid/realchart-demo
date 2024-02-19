////////////////////////////////////////////////////////////////////////////////
// issue530.L.spec.ts
// 2024. 01. 30. created by dltlghkd930217
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////
declare global {
  var loadChart: (newConfig: any) => Promise<void>;
}
import { test } from "@playwright/test";
import { expect } from "chai";
import { PWTester } from "../PWTester";
import { SeriesView } from "../../../src/view/SeriesView";
import { Tooltip } from "../../../src/model/Tooltip";

/**
 * PlayWright Tests for issue530
 */
test.describe("issue530 test", () => {
  const url = "boundary/empty.html?debug";

  const config = {
    options: {},
    title: {
      text: "Axis Zooming",
      style: { marginBottom: "8px", fill: "white", fontSize: "1.1em" },
      backgroundStyle: { padding: "1px 5px", fill: "#338", rx: "5px" },
    },
    legend: true,
    body: { zoomType: "x", style: {} },
    xAxis: {
      title: "Period",
      crosshair: true,
      padding: 0,
      label: { autoArrange: "step" },
      line: { style: { stroke: "black", strokeWidth: 2 } },
      grid: { lastVisible: true },
      scrollBar: { visible: true },
    },
    yAxis: { title: "Hestavollane", line: true },
    series: {
      marker: {
        visible: true,
        shape: "diamond",
        radius: 5,
        style: { stroke: "white" },
      },
      data: [
        4.5, 5.1, 4.4, 3.7, 4.2, 3.7, 4.3, 4, 5, 4.9, 4.8, 4.6, 3.9, 3.8, 2.7,
        3.1, 2.6, 3.3, 3.8, 4.1, 1, 1.9, 3.2, 3.8, 4.2, 3.8, 3.3, 4.7, 4.8, 4.6,
        3.9, 3.8, 2.7, 3.1, 2.6, 3.3, 3.8, 4.8, 4.6, 3.9, 3.8, 2.7, 3.1, 2.6,
        3.3, 3.8, 4.1, 1, 1.9, 3.2, 3.8, 4.2, 3.8, 3.3, 4.7, 4.1, 3.9, 5, 4.1,
        3.9, 3.5, 2.7, 3.1, 2.6, 3.3, 3.8, 4.8, 4.6, 3.9, 3.8, 2.7, 3.1, 2.6,
        3.3, 3.8,
      ],
    },
  };

  test.beforeEach(async ({ page }) => {
    await PWTester.goto(page, url);
  });

  test("crosshair ", async ({ page }, testInfo) => {
    await page.evaluate((newConfig) => {
      return loadChart(newConfig);
    }, config);

    // Zoom 실행
    await page.mouse.move(111, 98);
    await page.mouse.down();
    await page.mouse.move(141, 98);
    await page.mouse.up();

    // 가장 좌측 마우스 이동 
    // 마우스를 이동시켜 yAxis의 crosshair가 yAxis영역까지 넘쳐 배경색이 변하는지 확인 #530
    await page.mouse.move(132, 125);
    await page.mouse.move(132, 145);

    await PWTester.testChartBySnapshot(page, testInfo);
  });
});