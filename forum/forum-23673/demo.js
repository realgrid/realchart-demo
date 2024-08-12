/**
 * @demo
 *
 */

const config = {
  type: 'line',
  polar: true,
  title: 'Polar Chart',
  xAxis: {
    grid: false,
    label: {
      style: {
        fontSize: '18px',
        fontWeight: 'bold'
      }
    },
    startAngle: -30,
    categories: ['P2', 'P3', 'P4', 'P5', 'P6', 'P7']
  },
  yAxis: {
    label: false,
    strictMax: 100,
    strictMin: 0
  },
  body: {
    circular: false,
    startAngle: -35
  },
  series: [{
    marker: {
      shape: 'star'
    },
    pointLabel: {
      visible: true,
      position: 'foot',
      offset: 30,
      numberFormat: '#,###.0',
      style: {
        fill: 'red'
      }
    },
    style: {
      stroke: 'purple',
      strokeWidth: '3px'
    },
    data: [100.0, 100.0, 100.0, 100.0, 100.0, 100.0]
  }]
};
let animate;
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}