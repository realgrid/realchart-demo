const config = {
  options: {},
  title: "Area - Negative",
  xAxis: {
    type: 'category'
  },
  yAxis: {},
  series: {
    type: 'area',
    style: {
      strokeWidth: '3px'
    },
    belowStyle: {
      stroke: 'red',
      fill: 'red'
    },
    data: [['home', 7], ['sky', 11], ['정우성', -7], ['def', 9], ['곽재식', -3], ['지리산', 15.3], ['zzz', 13], ['낙동강', 12.5]]
  }
};
const chart = RealChart.createChart(document, 'realchart', config);