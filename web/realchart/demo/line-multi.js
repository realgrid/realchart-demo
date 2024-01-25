/**
 * @demo
 *
 */
const config = {
  type: 'line',
  options: {
    theme: 'real',
    palette: 'unicorn',
  },
  title: '마스크 종류별 수출 현황',
  xAxis: {
    title: '날짜',
    type: 'time',
    // tick: true
  },
  yAxis: {
    title: '수출량',
  },
  templates: {
    line: {
      lineType: 'spline',
      marker: true,
      data: data,
      xField: 'date',
    },
  },
  series: [
    {
      template: 'line',
      name: '수술용',
      yField: '수술용',
    },
    {
      template: 'line',
      name: '보건용',
      yField: '보건용',
    },
    {
      template: 'line',
      name: '비말차단용',
      yField: '비말차단용',
    },
    {
      template: 'line',
      name: '기타',
      yField: '기타',
    },
  ],
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
