/**
 * @demo
 *
 * Linear grandient 예제
 */
const config = {
  title: 'Linear Gradient',
  options: {},
  assets: [
    {
      type: 'linearGradient',
      id: 'gradient-1',
      color: ['#0088ff', 'red'],
      opacity: [1, 0],
    },
  ],
  xAxis: {
    type: 'category',
    categories:['성남시', '용인시', '수원시', '일산시', '화성시', '평택시', '안양시', '부천시', '고양시',' 안산시']
  },
  yAxis: {},
  series: {
    type: 'area',
    lineType: 'spline',
    marker: {},
    data:  [7, 11, 9, 7.5, 15.3, 13, 7, 9, 11, 2.5],
    style: {
      fill: 'url(#gradient-1)',
      fillOpacity: 1,
      strokeWidth: '2px',
    },
  },
};

let chart;

function setActions(container) {
  createCheckBox(
    container,
    'Debug',
    function (e) {
      RealChart.setDebugging(_getChecked(e));
      chart.render();
    },
    false
  );
  createButton(container, 'Test', function (e) {
    alert('hello');
  });
  createListBox(
    container,
    'Line Type',
    ['default', 'spline', 'step'],
    function (e) {
      config.series.lineType = _getValue(e);
      chart.load(config);
    },
    'spline'
  );
  createCheckBox(
    container,
    'Point Marker',
    function (e) {
      config.series.marker.visible = _getChecked(e);
      chart.load(config);
    },
    true
  );
  createCheckBox(
    container,
    'Inverted',
    function (e) {
      config.inverted = _getChecked(e);
      chart.load(config);
    },
    false
  );
  createCheckBox(
    container,
    'X Reversed',
    function (e) {
      config.xAxis.reversed = _getChecked(e);
      chart.load(config);
    },
    false
  );
  createCheckBox(
    container,
    'Y Reversed',
    function (e) {
      config.yAxis.reversed = _getChecked(e);
      chart.load(config);
    },
    false
  );
}

function init() {
  console.log('RealChart v' + RealChart.getVersion());
  // RealChart.setDebugging(true);
  RealChart.setLogging(true);

  chart = RealChart.createChart(document, 'realchart', config);
  setActions('actions');
}
