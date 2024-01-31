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

  let config: any 

  test.beforeEach(async ({ page }, testInfo) => {
    config = {
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
