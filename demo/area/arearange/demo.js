const config = {
  title: "AreaRange Series",
  options: {},
  xAxis: {
    type: 'time',
    title: 'Time'
  },
  yAxis: {
    title: 'Temparature'
  },
  series: {
    type: 'arearange',
    // data: range_data,
    data: [['home', 7, 12], ['sky', 11, 17], ['def', 9, 13], ['지리산', 15.3, 21], ['zzz', 13, 19], ['낙동강', 12.5, 17]],
    pointLabel: {},
    marker: {}
  }
};
const chart = RealChart.createChart(document, 'realchart', config);