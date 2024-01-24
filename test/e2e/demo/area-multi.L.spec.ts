import { Utils } from "./../../../src/common/Utils";
import { PointStyleCallback } from "./../../../src/model/Series";
import { LineType } from "./../../../src/model/ChartTypes";
import { getCssProp, SVGStyles } from "./../../../src/common/Types";
////////////////////////////////////////////////////////////////////////////////
// area-multi.L.spec.ts
// 2023. 11. 17. created by dltlghkd930217
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from "@playwright/test";
import { expect } from "chai";
import { PWTester } from "../PWTester";
import { SeriesView } from "../../../src/view/SeriesView";

import { SvgShapes } from "../../../src/common/impl/SvgShape";
import { ElementHandle } from "puppeteer";
import path from "path";

/**
 * PlayWright Tests for area-multi.html
 */
test.describe("area-multi.html test", () => {
  let chart: any = null,
    config: any = null;

  const url = "demo/area-multi.html?debug";

  const sleep = async (time = 500) => {
    await new Promise((resolve) => setTimeout(resolve, time));
  };
  test.beforeEach(async ({ page }) => {
    await PWTester.goto(page, url);
  });

  test("init", async ({ page }) => {
    const container = await page.$("#realchart");
    expect(container).exist;
    config = await page.evaluate(() => config);
    expect(config.type).is.equal("area");
  });

  // firstVisible, lastVisible, maxVisible, minVisible은 구현이 되어있지 않아 테스트가 불가능.
  test.describe("area-multi.html marker", () => {
    // CIRCLE, DIAMON, RECTANGLE, SQUAURE, TRIANGLE, ITRIANGLE, STAR
    test("shape", async ({ page }) => {
      await page.evaluate(() => {
        config.series[0].marker = {
          visible: true,
          shape: "circle",
        };
      });
    });

    test("marker visible", async ({ page }) => {
      // series.marker 값 변경에 따른 rct-point 확인
      config = await page.evaluate(() => {
        // marker초기화
        config.series[0].children.forEach((c) => {
          c.marker = true;
        });

        chart.load(config, false);
        return config;
      });
      await sleep();

      let points = await page.$$(".rct-series-points");
      
      let opacities = await page.evaluate((points) => {
        return points.map((point) => {
          for (const p of point.children) {
            if (getComputedStyle(p).opacity !== '1')
              return '0';
          }
          return '1'
        });
      }, points);

      for (let opacity of opacities) {
        expect(opacity).is.equal("1");
      }

      config = await page.evaluate(() => {
        // marker초기화
        config.series[0].children.forEach((c) => {
          c.marker = false;
        });

        chart.load(config, false);
        return config;
      });
      await sleep();

      points = await page.$$(".rct-series-points");
      opacities = await page.evaluate((points) => {
        return points.map((point) => {
          for (const p of point.children) {
            if (getComputedStyle(p).opacity !== '0')
              return '1';
          }
          return '0'
        });
      }, points);

      for (const o of opacities) {
        expect(o).is.equal('0');
      }
    });

    test("style", async ({ page }) => {
      config = await page.evaluate(() => {
        // marker초기화
        config.series.forEach((c) => {
          c.marker = false;
        });

        config.series[0].children[0].visible = true;
        config.series[0].children[0].marker = {
          visible: true,
          style: {
            fill: "red",
          },
        };

        chart.load(config, false);
        return config;
      });
      await sleep();
      const marker = await page.$$("." + SeriesView.POINT_CLASS);

      const filledColor = await marker[0].evaluate((marker) => {
        const style = getComputedStyle(marker);
        return style.fill;
      }, marker[0]);

      expect(filledColor).is.equal("rgb(255, 0, 0)");
    });
  });

  // areaStyle,clipped,nullAsBase 은 구현이 되어있지 않아 테스트가 불가능.
  test.describe("area-multi.html area", () => {
    /**
     * baseValue는 데이터 최소값보다 클 수 없다?
     * BoxedSeriesView._layoutPoints 참고.
     */
    test("baseValue", async ({ page }) => {
      config = await page.evaluate(() => {
        config.series.forEach((s: any) => {
          s.baseValue = 0;
          s.lineType = "default";
        });

        return config;
      });

      // rct-area-series-area 는 높이 변화가 거의 없다. plot area 밖으로 벗어난다.
      let areas = await page.$$(".rct-line-series-line");
      const orgHeight = await page.evaluate((area: any) => {
        return area.getBBox().height;
      }, areas[0]);

      const data = config.series[0].children.reduce((acc, child) => acc.concat(child.data), []);
      const minValue = data.reduce(
        (acc, curr) => {
          return Math.min(acc, curr)
        },
        Number.MAX_SAFE_INTEGER
      );
      console.log({minValue})
      await page.evaluate((minValue) => {
        config.series[0].baseValue = minValue;

        chart.load(config, false);
      }, minValue);
      await sleep();

      areas = await page.$$(".rct-line-series-line");
      const baseValueHeight = await page.evaluate((area: any) => {
        return area.getBBox().height;
      }, areas[0]);
      // 축의 간격이 좁혀지면서 line영역이 더 커진다.
      expect(baseValueHeight).is.greaterThan(orgHeight);
    });

    test("color", async ({ page }) => {
      const firstColor = "rgb(255, 0, 0)";
      const secondColor = "rgb(0, 255, 0)";
      config = await page.evaluate((color) => {
        // 빨강
        config.series[0].children[0].color = color;

        chart.load(config, false);
        return config;
      }, firstColor);
      await sleep();

      let areas = await page.$$(".rct-area-series-area");

      let area: any = await page.evaluate((area) => {
        return area.style.fill;
      }, areas[0]);
      expect(area).is.equal(firstColor);

      config = await page.evaluate((color) => {
        config.series[0].children[0].color = color;

        chart.load(config, false);
        return config;
      }, secondColor);

      await sleep();

      areas = await page.$$(".rct-area-series-area");
      area = await page.evaluate((area) => {
        return window.getComputedStyle(area).fill;
      }, areas[0]);

      expect(area).is.equal(secondColor);
    });

    test("label", async ({ page }) => {
      const NAME = "name";
      const LABEL = "label";
      config = await page.evaluate(() => {
        return config;
      });

      let configLabel =
        config.series[0].children[0].label || config.series[0].children[0].name;

      let viewLabels = await page.$$(".rct-legend-item-label");

      let viewLabel = await page.evaluate((label) => {
        // '&'이 &amp;로 나오기 때문에 DOMParser를 사용하여 textContent를 추출해야한다.
        return new DOMParser().parseFromString(label.innerHTML, "text/html")
          .body.textContent;
      }, viewLabels[0]);

      expect(configLabel).is.equal(viewLabel);

      config = await page.evaluate(
        (obj) => {
          config.series[0].children[0].name = obj.NAME;

          config.series[0].children[0].label = obj.LABEL;

          chart.load(config, false);

          return config;
        },
        { NAME, LABEL }
      );
      await sleep();

      configLabel =
        config.series[0].children[0].label || config.series[0].children[0].name;

      viewLabels = await page.$$(".rct-legend-item-label");

      viewLabel = await page.evaluate((label) => {
        return label.innerHTML;
      }, viewLabels[0]);

      expect(configLabel).is.equal(LABEL).and.is.equal(viewLabel);

      config = await page.evaluate((NAME) => {
        config.series[0].children[0].name = NAME;

        config.series[0].children[0].label = undefined;

        chart.load(config, false);

        return config;
      }, NAME);

      await sleep();
      configLabel =
        config.series[0].children[0].label || config.series[0].children[0].name;

      viewLabels = await page.$$(".rct-legend-item-label");

      viewLabel = await page.evaluate((label) => {
        return label.innerHTML;
      }, viewLabels[0]);
      expect(configLabel).is.equal(NAME).and.is.equal(viewLabel);
    });

    test("lineType - default", async ({ page }) => {
      config = await page.evaluate(() => {
        config.series[0].children[0].lineType = "default";

        chart.load(config, false);
        return config;
      });

      let areas = await page.$$(".rct-area-series-area");
      let areaPath = await PWTester.getPathDValue(areas[0]);
      let pathArr = areaPath
        .split("L")
        .slice(1, -1)
        .map((item) => {
          return Number(item.trim().split(" ")[0]);
        });

      pathArr.reduce((acc, curr) => {
        expect(acc).is.lessThan(curr);
        return curr;
      }, 0);
    });
    test("lineType - step", async ({ page }) => {
      config = await page.evaluate(() => {
        config.series[0].children[0].lineType = "step";

        chart.load(config, false);
        return config;
      });

      await sleep();

      let areas = await page.$$(".rct-area-series-area");
      let areaPath = await PWTester.getPathDValue(areas[0]);
      let pathArr = areaPath
        .split("L")
        .slice(1, -1)
        .map((item) => {
          return Number(item.trim().split(" ")[0]);
        });

      pathArr.reduce((acc, curr, index) => {
        if (index % 2 === 0) {
          index !== 0 && expect(acc).is.equal(curr);
        } else {
          expect(acc).is.lessThan(curr);
        }
        return curr;
      }, 0);
    });
    test("lineType - spline", async ({ page }) => {
      config = await page.evaluate(() => {
        config.series[0].children[0].lineType = "spline";

        chart.load(config, false);
        return config;
      });

      await sleep();

      let areas = await page.$$(".rct-area-series-areas");
      let area = await areas[0].$(".rct-area-series-area");
      expect(area).is.not.null;
      if (area) {
        let areaPath = await PWTester.getPathDValue(area);
        expect(areaPath).is.not.null;
        expect(areaPath?.includes("Q")).is.true;
      }
    });

    test("onPointClick", async ({ page }) => {
      let clicked = 0;

      // 콘솔 메시지를 감지하여 처리
      page.on("console", (message) => {
        if (message.text().includes("clicked")) {
          clicked++;
        }
      });

      config = await page.evaluate(() => {
        config.series[0].children[0].visible = true;
        config.series[0].children[1].visible = false;
        config.series[0].children[0].onPointClick = () => {
          console.log("clicked");
        };

        chart.load(config, false);
        return config;
      });
      await sleep();

      const clickHandle = await page.$$(".rct-point");
      const count = 3;
      for (let i = 0; i < count; i++) {
        await clickHandle[0].click();
        await sleep();
      }
      expect(count).is.equal(clicked);
    });

    test("pointColors", async ({ page }) => {
      const colorArray = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)"];
      config = await page.evaluate((colors) => {
        config.series[0].children[0].pointColors = colors;

        chart.load(config, false);

        return config;
      }, colorArray);
      await sleep();
      const areaSeries = await page.$$(".rct-area-series");
      const firstAreaSeries = areaSeries[0];

      const points = await firstAreaSeries.$$(".rct-point");

      const viewColors = await page.evaluate((points) => {
        const colors = points.map((point) => {
          return window.getComputedStyle(point).fill;
        });

        return colors;
      }, points);

      for (let index = 0; index < viewColors.length; index++) {
        const expectedColor = colorArray[index % colorArray.length];
        const actualColor = viewColors[index];
        expect(actualColor).is.equal(expectedColor);
      }
    });

    test("pointStyleCallback", async ({ page }) => {
      const RED = "rgb(255, 0, 0)";
      const GREEN = "rgb(0, 255, 0)";
      const DEFAULT = "rgb(0, 152, 255)";

      config = await page.evaluate(
        (obj) => {
          config.series[0].children[0].pointStyleCallback = ({
            yValue,
            xValue,
          }) => {
            if (yValue < 200) {
              return {
                fill: obj.RED,
              };
            } else if (xValue > 6) {
              return {
                fill: obj.GREEN,
              };
            }
          };
          chart.load(config, false);
          return config;
        },
        { RED, GREEN }
      );

      await sleep();
      const areaSeries = await page.$$(".rct-area-series");
      const firstAreaSeries = areaSeries[0];

      const points = await firstAreaSeries.$$(".rct-point");

      const data = config.series[0].children[0].data;

      const expectColors = data.map((d, idx) => {
        if (d < 200) {
          return RED;
        } else if (idx > 6) {
          return GREEN;
        } else {
          return DEFAULT;
        }
      });

      const viewColors = await page.evaluate((points) => {
        const colors = points.map((point) => {
          return window.getComputedStyle(point).fill;
        });

        return colors;
      }, points);

      await sleep();

      for (let index in expectColors) {
        expect(expectColors[index]).is.equal(viewColors[index]);
      }
    });

    test("stepDir - backward", async ({ page }) => {
      config = await page.evaluate(() => {
        config.series[0].children[0].lineType = "step";
        config.series[0].children[0].stepDir = "backward";

        chart.load(config, false);

        return config;
      });

      let areas = await page.$$(".rct-area-series-area");
      let areaPath = await PWTester.getPathDValue(areas[0]);
      let pathArr = areaPath
        .split("L")
        .slice(1, -1)
        .map((item) => {
          return Number(item.trim().split(" ")[0]);
        });

      let pathYArr = areaPath
        .split("L")
        .slice(1, -1)
        .map((item) => {
          return Number(item.trim().split(" ")[1]);
        });

      console.log(pathYArr);

      pathArr.reduce((acc, curr, index) => {
        if (index % 2 === 0) {
          index !== 0 && expect(acc).is.lessThan(curr);
        } else {
          expect(acc).is.equal(curr);
        }
        return curr;
      }, pathArr[0]);

      pathYArr.reduce((acc, curr, index) => {
        if (index % 2 === 0) {
          index !== 0 && expect(acc).is.equal(curr);
        }
        return curr;
      }, 0);
    });

    test("style", async ({ page }) => {
      const firstColor = { fill: "rgb(255, 0, 0)" };
      const secondColor = { fill: "rgb(0, 255, 0)" };
      config = await page.evaluate((color) => {
        config.series[0].children[0].visible = true;
        // 빨강
        config.series[0].children[0].style = color;

        chart.load(config, false);
        
      }, firstColor);
      await sleep();

      let areas = await page.$$(".rct-area-series-area");

      // const colorValue = await page.evaluate((selector, variableName) => {
      //   const element = document.querySelector(selector);
      //   if (element) {
      //     // getComputedStyle를 사용하여 계산된 스타일 가져오기
      //     const computedStyle = getComputedStyle(element);
      //     // CSS 변수 값 가져오기
      //     return computedStyle.getPropertyValue(variableName).trim();
      //   }

      let area = await page.evaluate((area) => {
        return getComputedStyle(area).fill;
      }, areas[0]);

      // areaStyle.getPropertyValue('--color-1');

      expect(area).is.equal(firstColor.fill);

      config = await page.evaluate((color) => {
        config.series[0].children[0].style = color;

        chart.load(config, false);
        return config;
      }, secondColor);

      await sleep();

      areas = await page.$$(".rct-area-series-area");
      area = await page.evaluate((area) => {
        return getComputedStyle(area).fill;
      }, areas[0]);

      expect(area).is.equal(secondColor.fill);
    });

    test("visible", async ({ page }) => {
      config = await page.evaluate(() => {
        config.series[0].children.forEach((item) => {
          item.visible = true;
        });

        // visible을 끌 경우 legend에도 변화가 있기 때문에 같이 확인한다.
        config.legend = true;

        chart.load(config, false);

        return config;
      });
      const seriesCount = config.series[0].children.length;
      const orgSeries = await page.$$(".rct-area-series");
      const orgSeriesLength = orgSeries.length;

      expect(seriesCount).is.equal(orgSeriesLength);

      config = await page.evaluate(() => {
        config.series[0].children[0].visible = false;

        chart.load(config, false);

        return config;
      });
      await sleep();

      let series = await page.$$(".rct-area-series");
      let seriesLength = series.length;
      let legends = await page.$$(".rct-legend-item-label");

      page.on('console', msg => { console.log(msg) });
      
      const legendStyle = await page.evaluate((legend) => {
        console.log(getComputedStyle(legend).toString());
        return getComputedStyle(legend).textDecorationLine;
      }, legends[0]);

      // visible이 꺼저있는 경우 textDecorationLine이 line-through여야 한다.
      expect(legendStyle).is.equal("line-through");

      expect(orgSeriesLength).is.greaterThan(seriesLength);

      expect(orgSeriesLength - 1).is.equal(seriesLength);

      config = await page.evaluate(() => {
        config.series[0].children[0].visible = true;

        chart.load(config, false);

        return config;
      });
      await sleep();
      series = await page.$$(".rct-area-series");
      seriesLength = series.length;

      expect(orgSeriesLength).is.equal(seriesLength);
    });

    test("visibleInLegend", async ({ page }) => {
      config = await page.evaluate(() => {
        config.series[0].children.forEach((item) => {
          item.visible = true;
        });

        // visible을 끌 경우 legend에도 변화가 있기 때문에 같이 확인한다.
        config.legend = true;

        chart.load(config, false);

        return config;
      });
      let legends = await page.$$(".rct-legend-item-label");
      let seriesCount = config.series[0].children.length;

      expect(legends.length).is.equal(seriesCount);

      config = await page.evaluate(() => {
        config.series[0].children[0].visibleInLegend = false;

        chart.load(config, false);

        return config;
      });

      await sleep();
      legends = await page.$$(".rct-legend-item-label");
      seriesCount = config.series[0].children.length;

      expect(seriesCount).is.greaterThan(legends.length);
      expect(seriesCount - 1).is.equal(legends.length);
    });
  });
});
