const config = {
  type: 'equalizer',
  title: "Multiple Equalizer",
  xAxis: {
    // type: 'category',
    // position: 'apposite'
    // position: 'base',
    // baseAxis: 1,
    title: 'X Axis',
    categories: ['쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도']
  },
  yAxis: {
    title: 'Y Axis'
  },
  series: [{
    pointLabel: {
      visible: true,
      // position: 'head',
      // offset: 10,
      // text: '<b style="fill:red">${x}</b>',
      effect: 'outline',
      // 'background',
      style: {}
    },
    data: [11, 22, 15, 9, 13, 27],
    style: {}
  }, {
    // color: '#00880080',
    pointLabel: {
      visible: true,
      // position: 'head',
      // offset: 10,
      // text: '<b style="fill:red">${x}</b>',
      effect: 'outline',
      // 'background',
      style: {}
    },
    data: [15, 19, 19, 6, 21, 21],
    style: {}
  }]
};
const chart = RealChart.createChart(document, 'realchart', config);