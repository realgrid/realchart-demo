const config = {
  series: {
    type: 'pie',
    startAngle: -90,
    totalAngle: 180,
    innerRadius: '50%',
    radius: '70%',
    centerY: '80%',
    legendByPoint: true,
    pointLabel: {
      text: '${x}<br>${y}%',
      position: 'outside',
      visible: true
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
      x: '기타',
      y: 6.63
    }]
  }
};
let animate = false;
let chart;
function init() {
  chart = RealChart.createChart(document, 'realchart', config);
}