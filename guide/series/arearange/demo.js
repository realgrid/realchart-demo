const config = {
  xAxis: {
    type: 'time',
    grid: true
  },
  yAxis: {
    title: 'Temparature',
    tick: true
  },
  series: {
    type: 'arearange',
    data: [[20.6, 17.2], [25.9, 18.7], [22.4, 17.7], [20.9, 14.1], [20.4, 15.1], [19.3, 6.6], [9.9, 3.6], [16.1, 1.8], [18.4, 5.9], [9.1, 0.5], [6.7, -1.9], [5.7, -2], [6.7, -2.2], [10.8, -0.8], [12.5, 2], [7.4, 5.7], [5.9, -1.9], [5.7, -3.8], [13.4, -0.3], [12.8, 1.8], [14.8, 1.4], [15.1, 2.9], [14.6, 1.9], [2.2, -4.4], [4, -5.9], [7.2, -0.1], [9.3, 4.4], [4, -3], [2.4, -5.6], [1.4, -7.8]],
    xStart: '2023-11-01',
    xStep: '1d',
    marker: false,
    style: {
      fill: '#66d0ff',
      stroke: 'none'
    }
  }
};
let animate = false;
let chart;
function init() {
  chart = RealChart.createChart(document, 'realchart', config);
}