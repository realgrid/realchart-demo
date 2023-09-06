const config = {
  options: {},
  title: "Area - Resize",
  subtitle: 'Sub title',
  xAxis: {
    title: 'X Axis',
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yAxis: {
    title: 'Y Axis'
  },
  series: [{
    // type: 'area',
    // lineType: 'spline',
    pointLabel: true,
    data: [4.2, 5.7, 7.9, 13.9, 18.2, 21.4, 25.0, 26.4, 22.8, 17.5, 12.1, 7.6]
  }, {
    type: 'line',
    color: 'blue',
    // pointLabel: true,
    data: [4.2, 5.7, 7.9, 13.9, 18.2, 21.4, 25.0, 26.4, 22.8, 17.5, 12.1, 7.6].reverse()
  }]
};
const chart = RealChart.createChart(document, 'realchart', config);