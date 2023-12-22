const config = {
  gauge: {
    value: 100,
    maxValue: 200
  }
};
let animate = false;
let chart;
function init() {
  chart = RealChart.createChart(document, "realchart", config);
}