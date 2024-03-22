/**
 * @demo
 *
 * Linear grandient 예제
 */
const config = {
  title: 'Linear Gradient',
  options: {},
  assets: [{
    type: 'linearGradient',
    id: 'gradient-1',
    color: ['#0088ff'],
    opacity: [1, 0]
  }],
  xAxis: {
    type: 'category',
    categories: ['성남시', '용인시', '수원시', '일산시', '화성시', '평택시', '안양시', '부천시', '고양시', ' 안산시']
  },
  yAxis: {},
  series: {
    type: 'area',
    lineType: 'spline',
    marker: {},
    data: [7, 11, 9, 7.5, 15.3, 13, 7, 9, 11, 2.5],
    style: {
      fill: 'url(#gradient-1)',
      fillOpacity: 1,
      strokeWidth: '2px'
    }
  }
};
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  // RealChart.setDebugging(true);
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}