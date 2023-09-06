const config = {
  options: {
    animatable: false
  },
  title: "Axis Labels",
  xAxis: {
    title: 'X Axis',
    categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', '마리아', 'Leon', 'Anna', 'Tim', 'Laura'],
    categories_s: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', '마리아', 'Leon', 'Anna', 'Tim', 'Laura'],
    categories_l: ['Alexander-Long', 'Marie-Long', 'Maximilian-Long', 'Sophia-Long', 'Lukas-Long', '마리아-Long', 'Leon-Long', 'Anna-Long', 'Tim-Long', 'Laura-Long'],
    grid: true,
    label: {
      // rotation: -90
    }
  },
  yAxis: {
    title: 'Y Axis',
    grid: true
  },
  series: {
    pointLabel: {
      visible: true,
      // position: 'head',
      // offset: 10,
      // text: '<b style="fill:red">${x}</b>',
      effect: 'outline',
      // 'background',
      style: {}
      // backgroundStyle: {
      //     fill: '#004',
      //     padding: '5px'
      // }
    },

    data: [31231, 12311, 53453, 43242, 19953, 12000, 39021, 41001, 37800, 25123],
    style: {
      // fill: 'yellow'
    }
  }
};
const chart = RealChart.createChart(document, 'realchart', config);