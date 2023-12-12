/**
 * @demo
 *
 * AreaRange 시리즈 기본 예제.
 */
const config = {
  title: "2023년 11월 서울 최고,최저 기온",
  subtitle: {
    align: "left",
    text: "출처: 웨더아이",
    style: {
      fill: "#AAA",
    },
  },
  options: {
    // animatable: false
  },
  xAxis: {
    type: "time",
    title: "Time",
  },
  yAxis: {
    title: "Temparature",
    tick: true,
  },
  series: [
    {
      type: "arearange",
      name: "11월 최고,최저 기온",
      data: [
        [20.6, 17.2],
        [25.9, 18.7],
        [22.4, 17.7],
        [20.9, 14.1],
        [20.4, 15.1],
        [19.3, 6.6],
        [9.9, 3.6],
        [16.1, 1.8],
        [18.4, 5.9],
        [9.1, 0.5],
        [6.7, -1.9],
        [5.7, -2],
        [6.7, -2.2],
        [10.8, -0.8],
        [12.5, 2],
        [7.4, 5.7],
        [5.9, -1.9],
        [5.7, -3.8],
        [13.4, -0.3],
        [12.8, 1.8],
        [14.8, 1.4],
        [15.1, 2.9],
        [14.6, 1.9],
        [2.2, -4.4],
        [4, -5.9],
        [7.2, -0.1],
        [9.3, 4.4],
        [4, -3],
        [2.4, -5.6],
        [1.4, -7.8],
      ],
      xStart: "2023-11",
      xStep: "1d",
      pointLabel: {},
      marker: {
        visible: false,
      },
      style: {
        fill: "#66d0ff",
        stroke: "none",
      },
    },
    {
      type: "line",
      name: "11월 평균기온",
      data: [
        18.9, 22.29, 20.04, 17.5, 17.75, 12.95, 6.75, 8.95, 12.15, 4.8, 2.4,
        1.85, 2.25, 5, 7.25, 6.55, 2, 0.95, 6.55, 7.3, 8.1, 9, 8.25, -1.1,
        -0.95, 3.55, 6.85, 0.5, -1.6, -3.2,
      ],
      tooltip: {
        followPointer: true,
        visible: true,
        text: '${x} 평균 온도 : ${y}°C'
      },
      xStart: "2023-11",
      xStep: "1d",
      style: {
        fill: "#eee",
        stroke: "#0098ff",
      },
    },
  ],
};

let animate = false;
let chart;

function setActions(container) {
  createCheckBox(
    container,
    "Debug",
    function (e) {
      RealChart.setDebugging(_getChecked(e));
      chart.render();
    },
    false
  );
  createButton(container, "Test", function (e) {
    alert("hello");
  });
  createCheckBox(
    container,
    "Curved",
    function (e) {
      config.series.curved = _getChecked(e);
      chart.load(config);
    },
    false
  );
  createCheckBox(
    container,
    "Point Marker",
    function (e) {
      config.series.marker.visible = _getChecked(e);
      chart.load(config);
    },
    true
  );
  createCheckBox(
    container,
    "Inverted",
    function (e) {
      config.inverted = _getChecked(e);
      chart.load(config);
    },
    false
  );
  createCheckBox(
    container,
    "X Reversed",
    function (e) {
      config.xAxis.reversed = _getChecked(e);
      chart.load(config);
    },
    false
  );
  createCheckBox(
    container,
    "Y Reversed",
    function (e) {
      config.yAxis.reversed = _getChecked(e);
      chart.load(config);
    },
    false
  );
}

function init() {
  console.log("RealChart v" + RealChart.getVersion());
  // RealChart.setDebugging(true);
    RealChart.setLogging(true);

  chart = RealChart.createChart(document, "realchart", config);
  setActions("actions");
}
