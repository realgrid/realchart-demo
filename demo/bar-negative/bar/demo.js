const config = {
  title: "Bar Negative",
  options: {},
  xAxis: {},
  yAxis: {},
  series: {
    // baseValue: null,
    pointLabel: {
      visible: true,
      // position: 'foot',
      effect: 'outline'
    },
    data: [['home', 7], ['sky', 11], ['def', -9], ['지리산', 14.3], ['유튜브', -5], ['zzz', 13], ['낙동강', 12.5]]
  }
};
const chart = RealChart.createChart(document, 'realchart', config);