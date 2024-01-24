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
      type: "linear",
      title: {
        visible: true,
      },
      tick: {
        visible: true,
        steps: [
          0,1,2,3
        ]
      }
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


  test("tick and path", async ({ page }) => {
    const container = await page.$("#realchart");

    config.xAxis.type = "category";
    config.xAxis.categories = [];
    await page.evaluate((newConfig) => {
      chart.load(newConfig, false);
    }, config);
    const xAxis = await PWTester.getAxis(page, "x");
    const ticks = await xAxis.$$(".rct-axis-tick");

    expect(ticks.length).is.greaterThan(0);
    expect(ticks.length).is.equal(config.series[0].data.length);

    const points = await page.$$(".rct-point");

    for(let point of points){
      const bounds = await PWTester.getBounds(point);
      expect(bounds.x).is.greaterThan(0);
      const path = await PWTester.getPathDValue(point);
      expect(Number(path?.split(" ")[1])).is.greaterThan(0);
    }
  }); 

  test.describe("title", () => {
    test.beforeEach(async ({ page }) => {
      await PWTester.goto(page, url);

      page.on("console", (consoleMessage) => {
        // 에러 레벨의 콘솔 메시지를 캡처
        if (consoleMessage.type() === "error") {
          console.error("Console Error:", consoleMessage.text());
        }
      });
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

    test("title length", async ({ page }) => {
      // 최대 길이를 초과하는 타이틀로 설정한 경우의 테스트
      const maxLengthTitle = "x".repeat(500);
      config.xAxis.title.text = maxLengthTitle;

      await page.evaluate((newConfig) => {
        chart.load(newConfig, false);
      }, config);

      // 너비는 #realchart보다 넓어야한다.

      const xAxis = await PWTester.getAxis(page, "x");
      const title = await xAxis.$$(".rct-axis-title");

      const titleText = await page.evaluate((title) => {
        return title[0].textContent;
      }, title);

      const rect = await page.evaluate((title) => {
        return title[0].getBoundingClientRect();
      }, title);

      expect(titleText).is.equal("x".repeat(500));
      // #Realchart보다 길어야한다.
      expect(rect.width).is.greaterThan(850);
    });

    test("empty value", async ({ page }) => {
      config.xAxis.title.text = null;

      await page.evaluate((newConfig) => {
        return chart.load(newConfig, false);
      }, config);

      // 너비는 #realchart보다 넓어야한다.

      const xAxis = await PWTester.getAxis(page, "x");
      const title = await xAxis.$$(".rct-axis-title");
      const titleText = await page.evaluate((title) => {
        //@ts-ignore
        window.title = title;
        return title[0].textContent;
      }, title);

      expect(titleText).is.equal("");
    });

    test("align", async ({ page }) => {
      config.xAxis.title = {
        visible: true,
        text: "TITLE",
        align: "middle",
      };

      await page.evaluate((newConfig) => {
        return chart.load(newConfig, false);
      }, config);

      // 너비는 #realchart보다 넓어야한다.

      const xAxis = await PWTester.getAxis(page, "x");
      let title = await xAxis.$$(".rct-axis-title");
      const defaultTranslate = await PWTester.getTranslate(title[0]);
      await PWTester.sleep(500);

      // align end
      config.xAxis.title.align = "end";
      await page.evaluate((newConfig) => {
        return chart.load(newConfig, false);
      }, config);
      title = await xAxis.$$(".rct-axis-title");
      const endTranslate = await PWTester.getTranslate(title[0]);
      await PWTester.sleep(500);

      // align start
      config.xAxis.title.align = "start";
      await page.evaluate((newConfig) => {
        return chart.load(newConfig, false);
      }, config);
      title = await xAxis.$$(".rct-axis-title");
      const startTranslate = await PWTester.getTranslate(title[0]);
      await PWTester.sleep(500);

      expect(endTranslate.x)
        .is.greaterThan(defaultTranslate.x)
        .and.is.greaterThan(startTranslate.x);
      expect(defaultTranslate.x)
        .is.greaterThan(startTranslate.x)
        .and.is.lessThan(endTranslate.x);
      expect(startTranslate.x)
        .is.lessThan(defaultTranslate.x)
        .and.is.lessThan(endTranslate.x);
    });

    test("gap", async ({ page }) => {
      config.xAxis.title.text = "TITLE";
      config.xAxis.title.gap = "";

      await page.evaluate((newConfig) => {
        return chart.load(newConfig, false);
      }, config);

      // 너비는 #realchart보다 넓어야한다.

      const xAxis = await PWTester.getAxis(page, "x");
      let title = await xAxis.$$(".rct-axis-title");
      const defaultTranslate = await PWTester.getTranslate(title[0]);
      await PWTester.sleep(500);

      // positive gap
      config.xAxis.title.text = "TITLE";
      config.xAxis.title.gap = 100;
      await page.evaluate((newConfig) => {
        return chart.load(newConfig, false);
      }, config);
      title = await xAxis.$$(".rct-axis-title");
      const positiveTranslate = await PWTester.getTranslate(title[0]);
      await PWTester.sleep(500);

      // negative gap
      config.xAxis.title.text = "TITLE";
      config.xAxis.title.gap = -100;
      await page.evaluate((newConfig) => {
        return chart.load(newConfig, false);
      }, config);
      title = await xAxis.$$(".rct-axis-title");
      const negativeTranslate = await PWTester.getTranslate(title[0]);
      await PWTester.sleep(500);

      expect(positiveTranslate.y)
        .is.greaterThan(defaultTranslate.y)
        .and.is.greaterThan(negativeTranslate.y);
      expect(defaultTranslate.y)
        .is.greaterThan(negativeTranslate.y)
        .and.is.lessThan(positiveTranslate.y);
      expect(negativeTranslate.y)
        .is.lessThan(defaultTranslate.y)
        .and.is.lessThan(positiveTranslate.y);
    });
  });

  
});
