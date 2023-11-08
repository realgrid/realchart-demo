const config = {
  options: {},
  title: "Line Series 01",
  xAxis: {
    type: 'category',
    tick: {
      step: 3
    }
  },
  yAxis: {},
  series: {
    type: 'line',
    lineType: 'spline',
    // step, default
    marker: true,
    pointLabel: true,
    data: [['home', 7], ['sky', 11], ['카눈', 8], ['def', 9], ['머핀', 11], ['지리산', 15.3], ['zzz', 13], ['낙동강', 12.5]]
  }
};
const chart = RealChart.createChart(document, 'realchart', config);