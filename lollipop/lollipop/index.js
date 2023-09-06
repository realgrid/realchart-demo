const config = {
  options: {},
  title: "Lollipop Series",
  xAxis: {
    type: 'category',
    grid: true
  },
  yAxis: {
    title: 'Y Axis'
  },
  series: {
    type: 'lollipop',
    pointLabel: {
      visible: true,
      // offset: 10,
      // text: '<b style="fill:red">${x}</b>',
      // effect: 'outline',// 'background',
      style: {
        fill: 'black'
      }
      // backgroundStyle: {
      //     fill: '#004',
      //     padding: '5px'
      // }
    },

    data: [['home', 7], ['sky', 11], ['def', 9], ['소홍', 10], ['지리산', 14.3], ['zzz', 13], ['낙동강', 12.5]],
    style: {
      // fill: 'yellow'
    }
  }
};
const chart = RealChart.createChart(document, 'realchart', config);