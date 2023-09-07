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
    label: {}
  },
  yAxis: {
    title: 'Y Axis',
    grid: true
  },
  series: {
    pointLabel: {
      visible: true,
      effect: 'outline',
      style: {}
    },
    data: [31231, 12311, 53453, 43242, 19953, 12000, 39021, 41001, 37800, 25123],
    style: {}
  }
};
const chart = RealChart.createChart(document, 'realchart', config);