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
test.describe("xAxis, linear test", () => {
  const url = "boundary/empty.html?debug";

  let chart;

  let config: any;

  test.beforeEach(async ({ page }) => {
    config = {
      title: "Boundary",
      xAxis: {
        type: "linear",
        title: {
          visible: true,
        },
        baseValue: 1000,
        label: {
          
        }
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
  });

  test("tick", async ({ page }, testInfo) => {
    config.xAxis.type = "category";
    config.xAxis.categories = [];
    config.xAxis.tick = {
      visible: true,
    };
    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);
    await PWTester.testChartBySnapshot(page, testInfo);
  });



  const autoArranges = ["none", "rotate", "rows", "step"];
  for (let autoArrange of autoArranges) {
    test("label autoArrange : " + autoArrange, async ({ page }, testInfo) => {

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
    
    config.xAxis.label = {
      firstText: "첫번째 라벨",
    };
    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });
  test("lastText", async ({ page }, testInfo) => {
    
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
    config.xAxis.label = {
      prefix: " prefix ",
    };
    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });

  test("rotation", async ({ page }, testInfo) => {
    config.xAxis.label = {
      rotation: 90,
    };
    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });

  test("rows", async ({ page }, testInfo) => {
    config.xAxis.label = {
      rows: 4,
    };

    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });

  test("step", async ({ page }, testInfo) => {
    config.xAxis.label = {
      step: 2,
    };

    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });

  test("startStep", async ({ page }, testInfo) => {
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
    config.xAxis.label = {
      suffix: "suffix"
    };

    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });

  test("rich text", async ({ page }, testInfo) => {
    config.xAxis.label = {
      text: "<t style='fill: red; font-weight: bold'>rich text</t>"
    };

    await page.evaluate((newConfig) => {
      chart.load(newConfig, false).render();
    }, config);

    await PWTester.testChartBySnapshot(page, testInfo);
  });


});
