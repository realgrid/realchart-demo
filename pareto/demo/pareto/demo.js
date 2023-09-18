const config = {
  title: "Pareto Series",
  options: {},
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
    tick: {},
    label: {
      suffix: '%'
    }
  }],
  series: [{
    name: 'main',
    pointLabel: true,
    data: [755, 222, 151, 86, 72, 51, 36, 10]
  }, {
    name: 'pareto',
    type: 'pareto',
    pointLabel: true,
    curved: true,
    source: 'main',
    yAxis: 1
  }]
};
const chart = RealChart.createChart(document, 'realchart', config);