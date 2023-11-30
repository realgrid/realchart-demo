import { Utils } from "./../../../src/common/Utils";
import { PointStyleCallback } from "./../../../src/model/Series";
import { LineType } from "./../../../src/model/ChartTypes";
import { getCssProp, StyleProps } from "./../../../src/common/Types";
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
      const removeSpace = (str: string) => {
        return str.replace(/\s/g, "");
      };

      const makeString = (arr: Object) => {
        if (Array.isArray(arr)) {
          return arr.join().replace(/,/g, "");
        }
        return;
      };

      // SvgShapes에서 모양을 확인할 수 있다.
      const SHAPES = [
        "circle",
        "diamond",
        "rectangle",
        "square",
        "triangle",
        "itriangle",
        "star",
      ];
      config = await page.evaluate(() => config);

      // 비동기 함수 정의
      const loadShapeAndGetPathValue = async (shape) => {
        await page.evaluate((shape) => {
          config.series.forEach((c) => {
            c.marker = false;
          });

          config.series[0].marker = {
            visible: true,
            shape: shape,
          };

          chart.load(config, false);
        }, shape);

        const markers = await page.$$("." + SeriesView.POINT_CLASS);

        return await PWTester.getPathDValue(markers[0]);
      };
      const shape = SHAPES[Utils.irandom(0, 6)];
      const pathValue = await loadShapeAndGetPathValue(shape);
      // 비동기 문제로인하여 아래 코드를 작성하지 않으면, pathValue값이 정상적으로 변경되지않아 테스트가 실패하는 경우가 있다.
      await sleep(1000);

      // pathValue를 기반으로 테스트 케이스 실행
      switch (shape) {
        case "circle":
          expect(removeSpace(pathValue)).to.equal(
            makeString(SvgShapes.circle(4, 4, 4))
          );
          break;
        case "diamond":
          expect(removeSpace(pathValue)).to.equal(
            makeString(SvgShapes.diamond(0, 0, 8, 8))
          );
          break;
        case "rectangle":
          expect(removeSpace(pathValue)).to.equal(
            makeString(SvgShapes.rectangle(0, 0, 8, 8))
          );
          break;
        case "square":
          expect(removeSpace(pathValue)).to.equal(
            makeString(SvgShapes.square(0, 0, 8, 8))
          );
          break;
        case "triangle":
          expect(removeSpace(pathValue)).to.equal(
            makeString(SvgShapes.triangle(0, 0, 8, 8))
          );
          break;
        case "itriangle":
          expect(removeSpace(pathValue)).to.equal(
            makeString(SvgShapes.itriangle(0, 0, 8, 8))
          );
          break;
        case "star":
          expect(removeSpace(pathValue)).to.equal(
            makeString(SvgShapes.star(0, 0, 8, 8))
          );
          break;
      }
    });

    test("marker visible", async ({ page }) => {
      // series.marker 값 변경에 따른 rct-point 확인
      const getTrueMarkers = (config) => {
        console.log(config.series)
        return config.series.reduce((acc: number, curr: any) => {
          return curr.marker === true || curr.marker?.visible === true
            ? acc + 1
            : acc;
        }, 0);
      };

       config = await page.evaluate(() => {
        // marker초기화
        config.series.forEach((c) => {
          c.marker = true;
        });

        chart.load(config, false);
        return config;
      }, );
      await sleep();

      let points = await page.$$(".rct-series-points");

      let opacities = await page.evaluate((points) => {

        const res = points.map((point) => point.style.opacity);
        return res;
        
      }, points);

      for(let opacity of opacities){
        expect(opacity).is.equal('1');
      }

      config = await page.evaluate(() => {
        // marker초기화
        config.series.forEach((c) => {
          c.marker = false;
        });

        chart.load(config, false);
        return config;
      }, );
      await sleep();
      points = await page.$$(".rct-series-points");
      opacities = await page.evaluate((points) => {

        const res = points.map((point) => point.style.opacity);
        return res;
        
      }, points);
      for(let opacity of opacities){
        expect(opacity).is.equal('0');
      }
    });

    test("style", async ({ page }) => {
      config = await page.evaluate(() => {
        // marker초기화
        config.series.forEach((c) => {
          c.marker = false;
        });

        config.series[0].marker = {
          visible: true,
          style: {
            fill: "red",
          },
        };

        chart.load(config, false);
        return config;
      });

      const marker = await page.$$("." + SeriesView.POINT_CLASS);

      const filledColor = await marker[0].evaluate((marker) => {
        const style = window.getComputedStyle(marker);
        return style.fill;
      }, marker[0]);

      expect(filledColor).is.equal("rgb(255, 0, 0)");
    });
  });

  // areaStyle,clipped,nullAsBase 은 구현이 되어있지 않아 테스트가 불가능.
  test.describe("area-multi.html area", () => {
    test("baseValue", async ({ page }) => {
      config = await page.evaluate(() => {
        config.series.forEach((s: any) => {
          s.baseValue = 0;
        });

        return config;
      });

      let areas = await page.$$(".rct-area-series-area");
      const orgHeight = await page.evaluate((area: any) => {
        return area.getBBox().height;
      }, areas[0]);

      await page.evaluate(() => {
        const minValue = config.series[0].data.reduce((acc, curr) => {
          return curr < acc ? curr : acc;
        }, config.series[0].data[0]);

        config.series[0].baseValue = minValue;

        chart.load(config, false);
      });
      await sleep();

      areas = await page.$$(".rct-area-series-area");
      const baseValueHeight = await page.evaluate((area: any) => {
        return area.getBBox().height;
      }, areas[0]);
      expect(orgHeight).is.greaterThan(baseValueHeight);
    });

    test("color", async ({ page }) => {
      const firstColor = "rgb(255, 0, 0)";
      const secondColor = "rgb(0, 255, 0)";
      config = await page.evaluate((color) => {
        // 빨강
        config.series[0].color = color;

        chart.load(config, false);
        return config;
      }, firstColor);

      let areas = await page.$$(".rct-area-series-area");

      let area :any = await page.evaluate((area) => {
        return area.style.fill
      }, areas[0]);
      expect(area).is.equal(firstColor);

      config = await page.evaluate((color) => {
        config.series[0].color = color;

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

      let configLabel = config.series[0].label || config.series[0].name;

      let viewLabels = await page.$$(".rct-legend-item-label");

      let viewLabel = await page.evaluate((label) => {
        // '&'이 &amp;로 나오기 때문에 DOMParser를 사용하여 textContent를 추출해야한다.
        return new DOMParser().parseFromString(label.innerHTML, "text/html")
          .body.textContent;
      }, viewLabels[0]);

      expect(configLabel).is.equal(viewLabel);

      config = await page.evaluate(
        (obj) => {
          config.series[0].name = obj.NAME;

          config.series[0].label = obj.LABEL;

          chart.load(config, false);

          return config;
        },
        { NAME, LABEL }
      );
      await sleep();

      configLabel = config.series[0].label || config.series[0].name;

      viewLabels = await page.$$(".rct-legend-item-label");

      viewLabel = await page.evaluate((label) => {
        return label.innerHTML;
      }, viewLabels[0]);

      expect(configLabel).is.equal(LABEL).and.is.equal(viewLabel);

      config = await page.evaluate((NAME) => {
        config.series[0].name = NAME;

        config.series[0].label = undefined;

        chart.load(config, false);

        return config;
      }, NAME);
      await sleep();
      configLabel = config.series[0].label || config.series[0].name;

      viewLabels = await page.$$(".rct-legend-item-label");

      viewLabel = await page.evaluate((label) => {
        return label.innerHTML;
      }, viewLabels[0]);

      expect(configLabel).is.equal(NAME).and.is.equal(viewLabel);
    });

    test("lineType - default", async ({ page }) => {
      config = await page.evaluate(() => {
        config.series[0].lineType = "default";

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
        config.series[0].lineType = "step";

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
        config.series[0].lineType = "spline";

        chart.load(config, false);
        return config;
      });

      await sleep();

      let areas = await page.$$(".rct-area-series-areas");
      let area =  await areas[0].$(".rct-area-series-area");
      let areaPath = await PWTester.getPathDValue(area);
      console.log(areaPath)
      expect(areaPath.includes("Q")).is.true;
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
        config.series[0].onPointClick = () => {
          console.log("clicked");
        };

        chart.load(config, false);
        return config;
      });

      const clickHandle = await page.$$(".rct-point");
      const count = Utils.irandom(4, 10);
      for (let i = 0; i < count; i++) {
        await clickHandle[0].click();
        await sleep();
      }
      expect(count).is.equal(clicked);
    });

    test("pointColors", async ({ page }) => {
      const colorArray = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)"];
      config = await page.evaluate((colors) => {
        config.series[0].pointColors = colors;

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
      const BLUE = "rgb(0, 255, 0)";
      const DEFAULT = "rgb(0, 152, 255)";

      config = await page.evaluate(
        (obj) => {
          config.series[0].pointStyleCallback = ({ yValue, xValue }) => {
            if (yValue < 100000) {
              return {
                fill: obj.RED,
              };
            } else if (xValue > 6) {
              return {
                fill: obj.BLUE,
              };
            }
          };
          chart.load(config, false);
          return config;
        },
        { RED, BLUE }
      );

      await sleep();
      const areaSeries = await page.$$(".rct-area-series");
      const firstAreaSeries = areaSeries[0];

      const points = await firstAreaSeries.$$(".rct-point");

      const data = config.series[0].data;

      const expectColors = data.map((d, idx) => {
        if (idx > 6) {
          return BLUE;
        } else if (d < 100000) {
          return RED;
        } else {
          return DEFAULT;
        }
      });

      debugger;

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
        config.series[0].lineType = "step";
        config.series[0].stepDir = "backward";

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
        // 빨강
        config.series[0].style = color;

        chart.load(config, false);
        return config;
      }, firstColor);
      await sleep();
      
      let areas = await page.$$(".rct-area-series-area");

      let area = await page.evaluate((area) => {
        return area.style.fill
      }, areas[0]);

      expect(area).is.equal(firstColor.fill);

      config = await page.evaluate((color) => {
        config.series[0].style = color;

        chart.load(config, false);
        return config;
      }, secondColor);

      await sleep();

      areas = await page.$$(".rct-area-series-area");
      area = await page.evaluate((area) => {
        return window.getComputedStyle(area).fill;
      }, areas[0]);

      expect(area).is.equal(secondColor.fill);
    });

    test("visible", async ({ page }) => {
      config = await page.evaluate(() => {
        config.series.forEach((item) => {
          item.visible = true;
        });

        // visible을 끌 경우 legend에도 변화가 있기 때문에 같이 확인한다.
        config.legend = true;

        chart.load(config, false);

        return config;
      });
      const seriesCount = config.series.length;
      const orgSeries = await page.$$(".rct-area-series");
      const orgSeriesLength = orgSeries.length;

      expect(seriesCount).is.equal(orgSeriesLength);

      config = await page.evaluate(() => {
        config.series[0].visible = false;

        chart.load(config, false);

        return config;
      });
      await sleep();

      let series = await page.$$(".rct-area-series");
      let seriesLength = series.length;
      let legends = await page.$$(".rct-legend-item-label");

      const legendStyle = await page.evaluate((legend) => {
        return window.getComputedStyle(legend).textDecorationLine;
      }, legends[0]);

      // visible이 꺼저있는 경우 textDecorationLine이 line-through여야 한다.
      expect(legendStyle).is.equal("line-through");

      expect(orgSeriesLength).is.greaterThan(seriesLength);

      expect(orgSeriesLength - 1).is.equal(seriesLength);

      config = await page.evaluate(() => {
        config.series[0].visible = true;

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
        config.series.forEach((item) => {
          item.visible = true;
        });

        // visible을 끌 경우 legend에도 변화가 있기 때문에 같이 확인한다.
        config.legend = true;

        chart.load(config, false);

        return config;
      });
      let legends = await page.$$(".rct-legend-item-label");
      let series = await page.$$(".rct-area-series");
      const seriesCount = config.series.length;

      expect(legends.length).is.equal(series.length).is.equal(seriesCount);

      config = await page.evaluate(() => {
        config.series[0].visibleInLegend = false;

        chart.load(config, false);

        return config;
      });

      await sleep();
      legends = await page.$$(".rct-legend-item-label");
      series = await page.$$(".rct-area-series");

      expect(series.length).is.greaterThan(legends.length);
      expect(series.length - 1).is.equal(legends.length);
    });

    test("xStart", async ({ page }) => {
      let xAxis = await PWTester.getAxis(page, "x");
      const orgLabelCount = (await xAxis.$$(".rct-axis-label")).length;

      console.log(orgLabelCount);

      config = await page.evaluate(() => {
        config.series[0].xStart = 2;

        chart.load(config, false);

        return config;
      });

      xAxis = await PWTester.getAxis(page, "x");
      await sleep();
      const labelCount = (await xAxis.$$(".rct-axis-label")).length;

      expect(orgLabelCount).is.lessThan(labelCount);
    });
  });
});
