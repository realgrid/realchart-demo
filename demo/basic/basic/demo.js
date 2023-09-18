const config = {
  options: {
    // animatable: false,
    credits: {}
  },
  title: "Basic Real-Chart",
  legend: true,
  xAxis: {
    // type: 'category',
    // position: 'apposite'
    // position: 'base',
    // baseAxis: 1,
    title: 'X Axis',
    grid: true
  },
  yAxis: {
    title: 'Y Axis'
  },
  series: {
    // baseValue: null,
    pointLabel: {
      visible: true,
      //position: 'head',
      // offset: 10,
      // text: '<b style="fill:red">${x}</b>',
      effect: 'outline',
      // 'background',
      style: {}
    },
    data: [['home', 7], ['sky', 11], ['def', 9], ['소홍', 10], ['지리산', 14.3], ['zzz', 13], ['낙동강', 12.5]],
    data2: [[1, 7], [2, 11], [3, 9], [4, 10], [5, 14.3], [6, 13], [7, 12.5]],
    style: {}
  }
};
const chart = RealChart.createChart(document, 'realchart', config);