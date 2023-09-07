const config = {
  options: {
    animatable: false
  },
  title: "Log Axis",
  xAxis: {
    // type: 'category',
    // type: 'linear'
    type: 'log'
  },
  yAxis: {
    type: 'log'
  },
  series: {
    type: 'line',
    xStart: 1,
    data: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]
  }
};
const chart = RealChart.createChart(document, 'realchart', config);