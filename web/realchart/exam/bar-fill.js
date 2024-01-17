const config = {
  title: "매입금액",
  templates: {
    pointLabel: {
      pointLabel: {
        visible: true,
        position: "inside",
        effect: "outline",
      },
    },
  },
  xAxis: {
    grid: {
      visible: !true,
    },
  },
  yAxis: {
    title: {
      text: "단위: 백만원",
      align: "end",
    },
  },
  series: [
    {
      layout: "fill",
      children: [
        {
          template: "pointLabel",
          name: "0~3일 이상",
          pointPadding: 0,
          data: [95.3, 93.3, 94, 88.4, 88.9, 88.9, 74.5, 74.6, 87.5, 10, 1, 0],
        },
        {
          template: "pointLabel",
          name: "4~5일 이상",
          pointPadding: 0,
          data: [4.3, 4.9, 0.4, 8, 10.6, 6.7, 21.7, 10.7, 6.3, 20, 10, 0],
        },
      ],
    },
  ],
  legend: {
    visible: true,
  },
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
  createCheckBox(
    container,
    "Always Animate",
    function (e) {
      animate = _getChecked(e);
    },
    false
  );
  createButton(container, "Test", function (e) {
    alert("hello");
  });
  createCheckBox(
    container,
    "Inverted",
    function (e) {
      config.inverted = _getChecked(e);
      chart.load(config, animate);
    },
    true
  );
  createCheckBox(
    container,
    "X Reversed",
    function (e) {
      config.xAxis[0].reversed = _getChecked(e);
      config.xAxis[1].reversed = _getChecked(e);
      chart.load(config, animate);
    },
    false
  );
  createCheckBox(
    container,
    "Y Reversed",
    function (e) {
      config.yAxis.reversed = _getChecked(e);
      chart.load(config, animate);
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
