const config = {
  options: {
    animatable: false,
    credits: {}
  },
  title: "Basic Real-Chart",
  legend: true,
  xAxis: {
    title: 'X Axis',
    grid: true
  },
  yAxis: {
    title: 'Y Axis'
  },
  series: {
    pointLabel: {
      visible: true,
      effect: 'outline',
      style: {}
    },
    data: [['home', 7], ['sky', 11], ['def', 9], ['소홍', 10], ['지리산', 14.3], ['zzz', 13], ['낙동강', 12.5]],
    data2: [[1, 7], [2, 11], [3, 9], [4, 10], [5, 14.3], [6, 13], [7, 12.5]],
    style: {}
  }
};
const chart = RealChart.createChart(document, 'realchart', config);