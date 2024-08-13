const config = {
  type: 'pie',
  title: 'Q3 2017',
  subtitle: {
    text: 'Mobile Traffic Analysis',
    style: {
      fontSize: '32px',
      fontWeight: 'bold'
    }
  },
  series: {
    radius: '40%',
    legendByPoint: true,
    pointLabel: {
      position: 'outside',
      text: '${x}<br>${y}%',
      visible: true,
      numberFormat: '#.00'
    },
    data: [{
      x: 'Android',
      y: 53.51,
      sliced: true
    }, {
      x: 'iOS',
      y: 29.14
    }, {
      x: 'Windows',
      y: 10.72
    }, {
      x: 'Others',
      y: 6.63
    }]
  }
};
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  chart = RealChart.createChart(document, 'realchart', config);
}