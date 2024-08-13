const config = {
  type: 'line',
  title: 'Annual Sales Trend',
  xAxis: {
    title: 'Year',
    categories: ['2014', '2015', '2016', '2017', '2018', '2019']
  },
  yAxis: {
    title: 'Sales'
  },
  series: [{
    pointLabel: true,
    marker: false,
    style: {
      strokeWidth: '2px'
    },
    data: [25, 30, 28, 35, 40, 50]
  }, {
    type: 'lollipop',
    visibleInLegend: false,
    style: {
      fill: '#EB5D39',
      stroke: '#EB5D39',
      strokeWidth: '2px',
      strokeDasharray: '4px'
    },
    data: [25, 30, 28, 35, 40, 50]
  }]
};
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}