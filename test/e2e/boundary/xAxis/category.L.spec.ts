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
test.describe("xAxis, category test", () => {
  const url = "boundary/empty.html?debug";
  const longCategories = [
    "11111111첫번째카테고리입니다11111111",
    "22222222두번째카테고리입니다22222222",
    "33333333세번째카테고리입니다33333333",
    "44444444네번째카테고리입니다44444444",
  ];
  const shortCategories = ["a", "b", "c", "d", "e"];
  let chart;

  let config: any;

  test.beforeEach(async ({ page }) => {
    config = {
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
    await PWTester.goto(page, url);
  });

  test("init", async ({ page }, testInfo) => {
    const container = await page.$("#realchart");
    expect(container).exist;

    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
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
      chart.load(newConfig, false).render();
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

  const autoArranges = ["none", "rotate", "rows", "step"];
  for (let autoArrange of autoArranges) {
    test("label autoArrange : " + autoArrange, async ({ page }, testInfo) => {
      config.xAxis.categories = longCategories;
      config.xAxis.label = {
        autoArrange,
      };
      await page.evaluate((newConfig) => {
        chart.load(newConfig, false).render();
      }, config);

      await PWTester.testChartBySnapshot(page, testInfo);
    });
  }

  const effects = ["background", "none", "outline"];
  for (let effect of effects) {
    test("label effect : " + effect, async ({ page }, testInfo) => {
      config.xAxis.categories = shortCategories;
      config.xAxis.label = {
        effect,
        style: {
          fill: "white",
        },
        backgroundStyle: {
          fill: "red",
        },
      };
      await page.evaluate((newConfig) => {
        chart.load(newConfig, false).render();
      }, config);

      await PWTester.testChartBySnapshot(page, testInfo);
    });
  }

  test("firstStyle", async ({ page }, testInfo) => {
    config.xAxis.categories = longCategories;
    config.xAxis.label = {
      firstStyle: {
        fill: "red",
        fontSize: "24px",
      },
    };
    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });
  test("lastStyle", async ({ page }, testInfo) => {
    config.xAxis.categories = longCategories;
    config.xAxis.label = {
      lastStyle: {
        fill: "red",
        fontSize: "24px",
      },
    };
    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });
  test("firstText", async ({ page }, testInfo) => {
    config.xAxis.categories = longCategories;
    config.xAxis.label = {
      firstText: "첫번째 라벨",
    };
    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });
  test("lastText", async ({ page }, testInfo) => {
    config.xAxis.categories = longCategories;
    config.xAxis.label = {
      lastText: "마지막 라벨",
    };
    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });

  // autoContrast
  // firstOverflow
  // lastOverflow
  // lightStyle
  // darkStyle
  // numberFormat
  // numberSymbols

  test("prefix", async ({ page }, testInfo) => {
    config.xAxis.categories = shortCategories;
    config.xAxis.label = {
      prefix: " prefix ",
    };
    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });

  test("rotation", async ({ page }, testInfo) => {
    config.xAxis.categories = shortCategories;
    config.xAxis.label = {
      rotation: 90,
    };
    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });

  test("rows", async ({ page }, testInfo) => {
    config.xAxis.categories = shortCategories;
    config.xAxis.label = {
      rows: 4,
    };

    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });

  test("step", async ({ page }, testInfo) => {
    config.xAxis.categories = shortCategories;
    config.xAxis.label = {
      step: 2,
    };

    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });

  test("startStep", async ({ page }, testInfo) => {
    config.xAxis.categories = shortCategories;
    config.xAxis.label = {
      startStep: 2,
      step: 2,
    };

    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });

  test("suffix", async ({ page }, testInfo) => {
    config.xAxis.categories = shortCategories;
    config.xAxis.label = {
      suffix: "suffix"
    };

    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });

  test("rich text", async ({ page }, testInfo) => {
    config.xAxis.categories = shortCategories;
    config.xAxis.label = {
      text: "<t style='fill: red; font-weight: bold'>rich text</t>"
    };

    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });
  
});
