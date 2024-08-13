const config = {
  title: 'Funnel Series',
  legend: {
    position: 'right',
    style: {
      marginTop: '16px',
      marginRight: '20px'
    }
  },
  series: [{
    type: 'funnel',
    legendByPoint: true,
    pointLabel: {
      visible: true,
      text: '${name} (${y})',
      position: 'outside'
    },
    data: [{
      name: 'Website Visits',
      y: 13293
    }, {
      name: 'Added to Cart',
      y: 4729
    }, {
      name: 'Checkout Page',
      y: 2742
    }, {
      name: 'Purchase Completed',
      y: 1391
    }]
  }]
};
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}