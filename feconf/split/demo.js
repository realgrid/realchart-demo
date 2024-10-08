const config = {
  type: 'bar',
  inverted: true,
  title: 'Wing Chart - Split Panes',
  legend: false,
  split: {
    visible: true,
    rows: 2
  },
  xAxis: {
    position: 'between',
    grid: true,
    categories: ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-40', '40-45', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80+']
  },
  yAxis: [{
    title: 'Male',
    reversed: true
  }, {
    row: 1,
    title: 'Female',
    tick: {
      baseRange: true,
      length: 5,
      margin: 0
    }
  }],
  series: [{
    name: 'Male',
    pointLabel: {
      visible: true,
      numberFormat: '##0.00'
    },
    data: [8.98, 7.52, 6.65, 5.72, 4.85, 3.71, 2.76, 2.07, 1.7, 1.47, 1.22, 0.99, 0.81, 0.62, 0.41, 0.23, 0.15]
  }, {
    name: 'Female',
    color: '#ffaa00',
    yAxis: 1,
    pointLabel: {
      visible: true,
      numberFormat: '##0.00'
    },
    data: [8.84, 7.42, 6.57, 5.68, 4.83, 3.74, 2.8, 2.14, 1.79, 1.59, 1.34, 1.06, 0.83, 0.63, 0.43, 0.25, 0.19]
  }]
};
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  chart = RealChart.createChart(document, 'realchart', config);
}