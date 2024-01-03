////////////////////////////////////////////////////////////////////////////////
// title.L.spec.ts
// 2024. 01. 03. created by dltlghkd930217
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from "@playwright/test";
import { expect } from "chai";
import { PWTester } from "../../PWTester";

test.describe("xAxis, title test", () => {
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

    page.on("console", (consoleMessage) => {
      // 에러 레벨의 콘솔 메시지를 캡처
      if (consoleMessage.type() === "error") {
        console.error("Console Error:", consoleMessage.text());
      }
    });
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

  test("null title", async ({ page }) => {
    config.xAxis.title.text = null;

    await page.evaluate((newConfig) => {
      chart.load(newConfig, false);
    }, config);

    const xAxis = await PWTester.getAxis(page, "x");
    const title = await xAxis.$$(".rct-axis-title");

    const titleText = await page.evaluate((title) => {
      return title[0].textContent;
    }, title);

    console.log(titleText);

    expect(titleText).is.not.true;
  });

  test("special character title", async ({ page }) => {
    const character = "😄 ⸝ဗီူ⸜ ･ิĹ̯･ิ (˵¯͒⌄¯͒˵)";
    config.xAxis.title.text = character;

    await page.evaluate((newConfig) => {
      chart.load(newConfig, false);
    }, config);

    const xAxis = await PWTester.getAxis(page, "x");
    const title = await xAxis.$$(".rct-axis-title");

    const titleText = await page.evaluate((title) => {
      return title[0].textContent;
    }, title);

    expect(titleText).is.equal(character);
  });

  test("min value", async ({ page }) => {
    config.xAxis.title.text = "title 22";
    config.xAxis.title.align = "start";
    config.xAxis.title.gap = -100;
    config.xAxis.title.offset = -100;

    await page.evaluate((newConfig) => {
      chart.load(newConfig, false);
    }, config);

    const xAxis = await PWTester.getAxis(page, "x");
    const title = await xAxis.$$(".rct-axis-title");

    const titleText = await page.evaluate((title) => {
      return title[0].textContent;
    }, title);

    expect(titleText).is.equal("title 22");
  });

  // 계속 작성
});
