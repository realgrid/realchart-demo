const config = {
  title: "AreaRange Null Point",
  options: {
    // animatable: false
  },
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
    data: [[13.7, 25.6], [13.3, 21.8], [11.2, null], [7.9, 17.3], [4.9, 20.6], [5.1, 16.8], [9.3, 21.1], [11.1, 20.5], [8.9, 18.4], [4.6, 23.2], [7.5, 25.7], [5.5, 24.3], [10.4, 21.2]],
    pointLabel: {},
    marker: {}
  }
};
const chart = RealChart.createChart(document, 'realchart', config);