const config = {
  options: {
    polar: true
  },
  title: "Polar Chart",
  xAxis: {},
  yAxis: {
    line: true,
    guide: [{
      type: 'line',
      value: 5.5,
      style: {
        stroke: 'red'
      }
    }]
  },
  series: [{
    type: 'bar',
    pointLabel: true,
    data: [['home', 7], ['sky', 11], ['def', 9], ['지리산', 14.3], ['zzz', 13], ['낙동강', 12.5]]
  }, {
    type: 'area',
    pointLabel: true,
    data: [['home', 13], ['sky', 9], ['def', 11], ['지리산', 12.3], ['zzz', 11], ['낙동강', 15.5]]
  }]
};
const chart = RealChart.createChart(document, 'realchart', config);