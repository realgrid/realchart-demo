const config = {
  options: {},
  title: "Area - Null Point",
  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yAxis: {},
  series: {
    type: 'area',
    pointLabel: true,
    data: [5.2, 5.7, 7.9, null, 18.2, 21.4, 25.0, 26.4, 22.8, 17.5, 12.1, 7.6]
  }
};
const chart = RealChart.createChart(document, 'realchart', config);