/**
 * @demo
 *
 */
const data = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24, 25, 26,
];

const  config = {
  title: "Boundary",

  xAxis: {
    categories: ["a", "b", "c", "d", "e"],
    title: {
      visible: true,
    },
    tick: true,
    label: {
      startStep: 2,
      step: 4,
    },
  },
  series: [
    {
      name: "column1",
      data: [1, 2, 3, 4,2,2,3,1,2,4,1,2,3,2,1,2,1,2],
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
    false
  );
  createCheckBox(
    container,
    "X Reversed",
    function (e) {
      config.xAxis.reversed = _getChecked(e);
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
