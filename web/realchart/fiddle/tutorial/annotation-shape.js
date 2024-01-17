/**
 * @demo
 *
 */

const config = {
  options: {},
  title: {
      text: "전국아파트 실거래 지수",
  },
  xAxis: {
      type: 'time',
      tick: {
          stepInterval: '2m'
      },
  },
  yAxis: {
      minValue: 0,
      tick: {
          stepInterval: 20,
      }
  },
  series: {
      name: 'main',
      type: 'line',
      lineType: 'spline',
      marker: false,
      xStart: '2020-01',
      xStep: '2m',
      data: [
          101, 103, 105, 109, 113, 115, 120, 125, 131, 136, 139, 143, 141, 140, 139, 138, 130, 125, 120, 119, 119, 120, 122, 123    
      ],
  },
  body: {
      annotations: [{
          type: 'shape',
          shape: 'rectangle',
          front: true,
          offsetX: 500,
          offsetY: 40,
          style: {
              fill: 'none',
              stroke: 'red',
              strokeWidth: '5px'
          }
      }]
  }
}

let animate = false;
let chart;

function init() {
  console.log('RealChart v' + RealChart.getVersion());
  // RealChart.setDebugging(true);
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}
