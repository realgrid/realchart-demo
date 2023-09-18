const config = {
  options: {},
  title: "Line Series - Step",
  xAxis: {},
  yAxis: {},
  series: {
    type: 'line',
    lineType: 'step',
    // stepDir: 'backward',
    marker: false,
    data: [['home', 7], ['sky', 11], ['def', 9], ['지리산', 15.3], ['zzz', 13], ['낙동강', 12.5]]
  }
};
const chart = RealChart.createChart(document, 'realchart', config);