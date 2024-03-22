const config = {
  series: {
    type: 'bar',
    data: [155, 138, 122, 133, 114, 113]
  }
};
let animate = false;
let chart;
function init() {
  chart = RealChart.createChart(document, 'realchart', config);
}