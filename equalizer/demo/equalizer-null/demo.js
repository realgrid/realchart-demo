const config = {
  options: {},
  title: "Equalizer Null Point",
  xAxis: {
    // type: 'category',
    // position: 'apposite'
    // position: 'base',
    // baseAxis: 1,
    title: 'X Axis'
  },
  yAxis: {
    title: 'Y Axis'
  },
  series: {
    type: 'equalizer',
    pointLabel: {
      visible: true,
      // position: 'head',
      // offset: 10,
      // text: '<b style="fill:red">${x}</b>',
      effect: 'outline',
      // 'background',
      style: {}
    },
    data: [['home', 10], ['sky', null], ['def', 9], ['지리산', 14.3], ['zzz', 13], ['낙동강', 12.5]],
    style: {}
  }
};
const chart = RealChart.createChart(document, 'realchart', config);