const config = {
  options: {
    animatable: false
  },
  title: "Time Axis",
  xAxis: {
    type: 'time',
    title: 'Time',
    crosshair: true,
    padding: 0
  },
  // yAxis: {
  //     title: 'Temparature'
  // },
  // series: {
  //     type: 'area',
  //     marker: false,
  //     data: range_data
  // },
  // yAxis: {
  //     title: 'Exchange Rate',
  //     minValue: 0.6
  // },
  // series: {
  //     type: 'area',
  //     marker: false,
  //     data: usdeur_data,
  //     baseValue: null
  // },
  yAxis: {
    title: 'Hestavollane'
  },
  series: {
    type: 'line',
    marker: false,
    xStart: "2023-07-12",
    xStep: 1000 * 60 * 60,
    data: [4.5, 5.1, 4.4, 3.7, 4.2, 3.7, 4.3, 4, 5, 4.9, 4.8, 4.6, 3.9, 3.8, 2.7, 3.1, 2.6, 3.3, 3.8, 4.1, 1, 1.9, 3.2, 3.8, 4.2]
  }
};
const chart = RealChart.createChart(document, 'realchart', config);