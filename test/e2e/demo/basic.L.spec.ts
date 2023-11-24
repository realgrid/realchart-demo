import { isArray } from "./../../../src/common/Common";
import { Legend } from "./../../../src/model/Legend";
////////////////////////////////////////////////////////////////////////////////
// basic.spec.L.ts
// 2023. 09. 22. created by dltlghkd930217
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Page, test } from "@playwright/test";
import { expect } from "chai";
import { PWTester } from "../PWTester";
import { SeriesView } from "../../../src/view/SeriesView";
import { TitleView } from "../../../src/view/TitleView";
import { LegendView } from "../../../src/view/LegendView";
import { BodyView } from "../../../src/view/BodyView";
import { RcChartControl } from "../../../src/main";

/**
 * PlayWright Tests for basic.html
 */
test.describe("basic.html test", () => {
  let chart: RcChartControl = null;
  const url = "demo/basic.html?debug";
  const sleep = async (time = 500) => {
    await new Promise((resolve) => setTimeout(resolve, time));
  };
  const getChildCount = async (el: any) => {
    if (!el) return 0;
    return await el.evaluate((el) => el.childElementCount);
  };

  test.beforeEach(async ({ page }) => {
    await PWTester.goto(page, url);
  });
  const getSvgSize = async (el: any) => {
    return await el.evaluate((el) => {
      const { width, height } = el.getBoundingClientRect();
      return { width, height };
    });
  };
  test("init", async ({ page }) => {
    // container
    const container = await page.$("#realchart");
    expect(container).to.exist;

    // body
    const body = await page.$("." + BodyView.BODY_CLASS);
    expect(body).to.exist;

    // title
    const title = await page.$("." + TitleView.TITLE_CLASS);
    expect(title).to.exist;

    // legend
    const legend = await page.$("." + LegendView.LEGEND_CLASS);
    expect(legend).to.exist;

    // x axis
    const xAxis = await PWTester.getAxis(page, "x");
    expect(xAxis).to.exist;

    // y axis
    const yAxis = await PWTester.getAxis(page, "y");
    expect(yAxis).to.exist;

    // series
    const bars = await page.$$("." + SeriesView.POINT_CLASS);
    expect(bars).to.exist;

    // point-label
    const labels = await page.$$("." + SeriesView.POINT_CLASS);
    expect(labels).to.exist;

    // grids
    const grids = await page.$(".rct-grids");
    expect(grids).to.exist;

    // credits
    const credit = await page.$(".rct-credits");
    expect(credit).to.exist;

    // tooltip
    const tooltip = await page.$(".rct-tooltip");
    expect(tooltip).to.exist;

    const a = await page.$$(".rct-point");
  });

  test("title", async ({ page }) => {
    let title = await page.$("." + TitleView.TITLE_CLASS);
    let config: any = await page.evaluate("config");

    let titleText = await page.evaluate((el) => el.textContent, title);
    expect(titleText).eq(config.title);

    // config의 title 변경
    await page.evaluate(() => {
      config.title = "TitleTest";
      chart.load(config, false);
    });
    await sleep();
    title = await page.$("." + TitleView.TITLE_CLASS);
    titleText = await page.evaluate((el) => el.textContent, title);
    config = await page.evaluate("config");

    expect(titleText).eq(config.title);
  });

  test("legend", async ({ page }) => {
    let legend = await page.$("." + LegendView.LEGEND_CLASS);
    let config: any = await page.evaluate("config");

    if (config.legend) {
      let legendItem = await page.$$(".rct-legend-item");
      expect(legendItem).to.exist;
      if (isArray(config.series)) {
        expect(legendItem.length).is.equal(config.series.length);
      } else {
        expect(legendItem.length).is.equal(1);
      }
    }
  });

  test("yAxis", async ({ page }) => {
    const yAxis = await PWTester.getAxis(page, "y");
    let config: any = await page.evaluate(() => {
      config.yAxis.line = true;
      chart.load(config, false);

      return config;
    });

    const ticks = await yAxis.$$(".rct-axis-tick");
    const labels = await yAxis.$$(".rct-axis-label");

    // expect(ticks.length).is.equal(labels.length);

    let prevTranslateTick = null;
    let prevTranslateLabel = null;
    for (let i = 0; i < ticks.length; i++) {
      const tick = ticks[i];
      const label = labels[i];

      const translateTick = await PWTester.getTranslate(tick);
      const translateLabel = await PWTester.getTranslate(label);

      if (prevTranslateTick) {
        expect(prevTranslateTick.x).is.equal(translateTick.x);
        expect(prevTranslateTick.y).is.greaterThan(translateTick.y);
        expect(prevTranslateLabel.y).is.greaterThan(translateLabel.y);
      }
      // label의 시작 부분은 tick보다 작아야 가운데에 있는것처럼 보일 수 있다.
      expect(translateTick.y).is.greaterThan(translateLabel.y);

      // tick의 가장 높은 높이와 line의 높이가 동일한지 확인한다.
      const axisLine = await yAxis.$(".rct-axis-line");
      const d = await axisLine.getAttribute("d");
      const coordinates = d?.match(/(\d+(\.\d+)?)/g).map(Number);
      const height = coordinates[3] - coordinates[1];

      if (i === 0) {
        expect(height).is.equal(translateTick.y);
      } else {
        expect(height).is.greaterThan(translateTick.y);
      }

      prevTranslateTick = translateTick;
      prevTranslateLabel = translateLabel;
    }
    // axis title
    const axisTitle = await yAxis.$(".rct-axis-title");
    expect(axisTitle).is.exist;

    const axisTitleContent = await page.evaluate(
      (el) => el.textContent,
      axisTitle
    );
    if (config.yAxis.title) {
      expect(config.yAxis.title.text).is.equal(axisTitleContent);
    }
  });

  test("xAxis", async ({ page }) => {
    const xAxis = await PWTester.getAxis(page, "x");
    let config: any = await page.evaluate(() => {
      config.xAxis.label = {};

      chart.load(config, false);

      return config;
    });

    const ticks = await xAxis.$$(".rct-axis-tick");
    const labels = await xAxis.$$(".rct-axis-label");

    // expect(ticks.length).is.equal(labels.length);

    let prevTranslateTick = null;
    let prevTranslateLabel = null;
    for (let i = 0; i < ticks.length; i++) {
      const tick = ticks[i];

      // 처음과 달라졌다 처음에는 .rct-axis-label에 translate이 있었는데 지금은 해당 클래스 하위요소에 있기때문에 직접 가져와야한다.
      const translateLabel = await page.evaluate((label) => {
        const svgElement = label.parentElement as unknown as SVGSVGElement;
        const transformList = svgElement.transform.baseVal;
        if (transformList.numberOfItems > 0) {
          // 첫 번째 변환을 가져오기
          const firstTransform = transformList.getItem(0);
          return {
            x: firstTransform.matrix.e,
            y: firstTransform.matrix.f,
          };
        }
        return { x: 0, y: 0 }; // 변환이 없는 경우 기본값 반환
      }, labels[i]);
      // const label = labels[i];

      const translateTick = await PWTester.getTranslate(tick);

      // const translateLabel = await PWTester.getTranslate(label);

      if (prevTranslateTick) {
        expect(prevTranslateTick.y).is.equal(translateTick.y);
        expect(prevTranslateTick.x).is.lessThan(translateTick.x);
        expect(prevTranslateLabel.x).is.lessThan(translateLabel.x);
      }
      console.log(translateTick);
      console.log(translateLabel);
      // xAxis는 label과 tick의 시작지점이 같다
      expect(translateTick.x).is.equal(translateLabel.x);

      // tick의 x가 line의 길이보다 작은지 확인한다.
      const axisLine = await xAxis.$(".rct-axis-line");
      const d = await axisLine.getAttribute("d");
      const coordinates = d.match(/(\d+(\.\d+)?)/g).map(Number);
      const width = coordinates[2] - coordinates[0];

      expect(width).is.greaterThan(translateTick.x);

      prevTranslateTick = translateTick;
      prevTranslateLabel = translateLabel;
    }

    // axis title
    const axisTitle = await xAxis.$(".rct-axis-title");
    expect(axisTitle).is.exist;

    const axisTitleContent = await page.evaluate(
      (el) => el.textContent,
      axisTitle
    );
    if (config.xAxis.title) {
      expect(config.xAxis.title.text).is.equal(axisTitleContent);
    }
  });

  test("plot", async ({ page }) => {
    const chartView = await page.$(".rct-chart");
    const body = await page.$(`.${BodyView.BODY_CLASS}`);
    const grids = await page.$(".rct-grids");
    const axisGrids = await page.$$(".rct-axis-grid");
    const barSeries = await page.$(".rct-series-container .rct-bar-series");
    const labelContainer = await page.$(".rct-label-container");

    // x axis
    const xAxis = await PWTester.getAxis(page, "x");
    expect(xAxis).to.exist;

    // y axis
    const yAxis = await PWTester.getAxis(page, "y");
    expect(yAxis).to.exist;

    const rChartView = await PWTester.getBounds(chartView);
    const rBody = await PWTester.getBounds(body);
    const gridChildCount = await getChildCount(grids);
    const xAxisGridChildCount = await getChildCount(axisGrids[0]);
    const yAxisGridChildCount = await getChildCount(axisGrids[1]);
    const rBarSeries = await PWTester.getBounds(barSeries);
    const config: any = await page.evaluate(() => config);

    // body (rct-plot)은 chartView보다 클 수 없다.
    expect(rChartView.width).is.greaterThan(rBody.width);
    expect(rChartView.height).is.greaterThan(rBody.height);
    expect(rChartView.x).is.lessThanOrEqual(rBody.x);
    expect(rChartView.y).is.lessThanOrEqual(rBody.y);

    const isGrid = await page.evaluate(() => config.xAxis.grid);

    if(isGrid){
      expect(gridChildCount).is.equal(2);
    }else {
      expect(gridChildCount).is.equal(1);
    }

    // rct-grids
    const xTicks = await xAxis.$(`.rct-axis-ticks`);
    const yTicks = await yAxis.$(`.rct-axis-ticks`);

    const [xTicksChildCount, yTicksChildCount] = await Promise.all([
      getChildCount(xTicks),
      getChildCount(yTicks),
    ]);

    // expect(xAxisGridChildCount).equal(xTicksChildCount + 1);
    // expect(yAxisGridChildCount).equal(yTicksChildCount);

    // rct-series-container
    expect(rBarSeries.width).is.lessThan(rBody.width);
    expect(rBarSeries.height).is.lessThan(rBody.height);
    expect(rBarSeries.x).is.greaterThan(rBody.x);
    expect(rBarSeries.y).is.greaterThan(rBody.y);

    const seriesPoints = await barSeries.$(".rct-series-points");
    const pointLabels = await labelContainer.$(".rct-point-labels");
    const points = await barSeries.$$(".rct-series-points .rct-point");
    const labels = await barSeries.$$(".rct-point-labels rct-point-label");
    const pointChildCount = await getChildCount(seriesPoints);
    const labelsChildCount = (await pointLabels.$$(".rct-point-label")).length;

    // rct-point
    // expect(pointChildCount).is.equal(xTicksChildCount);

    // rct-labels
    // expect(labelsChildCount).is.equal(xTicksChildCount);
    expect(labelsChildCount).is.equal(pointChildCount);

    for (let i = 0; i < points.length - 1; i++) {
      const [pointSize, nextPointSize] = await Promise.all([
        await getSvgSize(points[i]),
        await getSvgSize(points[i + 1]),
      ]);

      const value = config.series.data[i][1];
      const nextValue = config.series.data[i + 1][1];

      // 각각의 point의 높이를 실제 데이터 값과 비교했을때 높낮이 확인
      if (value > nextValue) {
        expect(pointSize.height).is.greaterThan(nextPointSize.height);
      } else if (value < nextValue) {
        expect(pointSize.height).is.lessThan(nextPointSize.height);
      } else if (value === nextValue) {
        expect(pointSize.height).is.equal(nextPointSize.height);
      }

      // labels의 값과 config값이 동일한지 확인
    }
  });
});
