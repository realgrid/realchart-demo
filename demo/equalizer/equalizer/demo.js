const config = {
  options: {},
  title: "Equalizer Series",
  xAxis: {
    title: 'X Axis'
  },
  yAxis: {
    title: 'Y Axis'
  },
  series: {
    type: 'equalizer',
    pointLabel: {
      visible: true,
      effect: 'outline',
      style: {}
    },
    data: [['home', 10], ['sky', 11], ['def', 9], ['지리산', 14.3], ['zzz', 13], ['낙동강', 12.5]],
    style: {}
  }
};
const chart = RealChart.createChart(document, 'realchart', config);