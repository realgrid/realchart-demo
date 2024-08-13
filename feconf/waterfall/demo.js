const config = {
  type: 'waterfall',
  title: 'Revenue and Costs Waterfall Analysis',
  xAxis: {
    title: 'Revenue and Expense Categories',
    grid: true
  },
  yAxis: {
    title: 'Amount in USD ($)'
  },
  series: {
    pointLabel: {
      visible: true,
      position: 'inside'
    },
    data: [{
      name: 'Start',
      y: 120000
    }, {
      name: 'Product Revenue',
      y: 569000
    }, {
      name: 'Service Revenue',
      y: 231000
    }, {
      name: 'Positive Balance',
      isSum: true
    }, {
      name: 'Fixed Costs',
      y: -342000
    }, {
      name: 'Variable Costs',
      y: -233000
    }, {
      name: 'Balance',
      isSum: true
    }]
  }
};
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}