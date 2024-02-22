const config = {
  series: [{
    layout: 'fill',
    children: [{
      name: 'group1',
      data: [11, 22, 15, 9, 13, 27],
      pointLabel: {
        visible: true,
        position: 'inside'
      }
    }, {
      name: 'group2',
      data: [15, 19, 19, 6, 21, 21],
      pointLabel: {
        visible: true,
        position: 'inside'
      }
    }, {
      name: 'group3',
      data: [13, 17, 15, 11, 23, 17],
      pointLabel: {
        visible: true,
        position: 'inside'
      }
    }]
  }]
};
let animate = false;
let chart;
function init() {
  chart = RealChart.createChart(document, 'realchart', config);
}