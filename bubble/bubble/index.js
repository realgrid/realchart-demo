const config = {
  options: {},
  title: "Bubble Series",
  xAxis: {},
  yAxis: {},
  series: {
    type: 'bubble',
    pointLabel: {
      visible: true,
      suffix: 'm'
    },
    data: [[9, 81, 63], [98, 5, 89], [51, 50, 73], [41, 22, 14], [58, 24, 20], [78, 37, 34], [55, 56, 53], [18, 45, 70], [42, 44, 28], [3, 52, 59], [31, 18, 97], [79, 91, 63], [93, 23, 23], [44, 83, 22]]
  }
};
const chart = RealChart.createChart(document, 'realchart', config);