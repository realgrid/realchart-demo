const config = {
  type: 'bar',
  title: 'Pareto Series',
  xAxis: {
    title: 'X Axis'
  },
  yAxis: [{
    title: 'Y Axis'
  }, {
    minValue: 0,
    maxValue: 100,
    padding: 0,
    position: 'opposite',
    tick: {
      baseAxis: 0
    },
    grid: false,
    label: {
      suffix: '%'
    }
  }],
  series: [{
    name: 'main',
    pointLabel: true,
    data: [755, 222, 151, 86, 72, 51, 36, 10]
  }, {
    type: 'pareto',
    name: 'pareto',
    pointLabel: true,
    curved: true,
    source: 'main',
    yAxis: 1
  }]
};
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}