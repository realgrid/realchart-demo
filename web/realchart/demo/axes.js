/**
 * @demo
 */
let config = {
  type: 'line',
  options: {
    theme: 'real',
    palette: 'unicorn',
  },
  title: {
    text: 'xAxis',
    style: {
      fontSize: '48px',
      fontWeight: 'bold',
    },
  },
  split: { visible: true, rows: 4, col: 1 },
  xAxis: [
    {
      type: 'category',
      categories: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      tick: { visible: true },
      row: 0,
    },
    {
      type: 'linear',
      tick: { visible: true, stepInterval: 1 },
      row: 1,
    },
    {
      type: 'time',
      tick: { visible: true, stepInterval: '1m' },
      row: 2,
    },
    {
      type: 'log',
      tick: {
        visible: true,
        stepInterval: 0.1,
      },
      row: 3,
    },
  ],
  yAxis: [
    {
      template: 'yAxis',
      title: {
        text: 'category',
      },
    },
    {
      template: 'yAxis',
      row: 1,
      title: {
        text: 'linear',
      },
    },
    {
      template: 'yAxis',
      row: 2,
      title: {
        text: 'time',
      },
    },
    {
      type: 'log',
      template: 'yAxis',
      row: 3,
      title: {
        text: 'log',
      },
    },
  ],
  tooltip: !false,
  legend: false,
  templates: {
    series: {
      marker: false,
      style: {
        strokeWidth: '3px',
      },
    },
    yAxis: {
      title: {
        rotation: 0,
      },
      label: false,
      tick: { visible: false },
    },
  },
  series: [
    {
      template: 'series',
      type: 'area',
      lineType: 'spline',
      data: [7, 11, 9, 7.5, 15.3, 13, 7, 9, 11, 2.5],
      xAxis: 0,
      yAxis: 0,
    },
    {
      template: 'series',
      lineType: 'spline',
      data: [7, 10, 8, 6.5, 15.3, 13, 10, 9.5, 11.5, 3.5],
      xAxis: 1,
      yAxis: 1,
    },
    {
      template: 'series',
      lineType: 'step',
      data: [7, 10, 8, 6.5, 15.3, 13, 10, 9.5, 11.5, 3.5],
      xStart: '2023-01',
      xStep: '1m',
      xAxis: 2,
      yAxis: 2,
    },
    {
      template: 'series',
      lineType: 'spline',
      data: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
      xAxis: 3,
      yAxis: 3,
    },
  ],
};

let chart;
let timer;

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
    'reversed',
    function (e) {
      config.gauge[0].reversed = _getChecked(e);
      chart.load(config);
    },
    false
  );
  createListBox(
    container,
    'label.position',
    ['', 'left', 'right', 'top', 'bottom'],
    function (e) {
      const pos = _getValue(e);
      config.gauge[0].label.position = pos;
      config.gauge[0].height = pos === 'top' || pos === 'bottom' ? 86 : 65;
      config.gauge[0].label.text =
        pos === 'top' || pos === 'bottom'
          ? 'RealChart Bullet ver 1.0'
          : 'RealChart Bullet<br>ver 1.0';
      chart.load(config);
    },
    ''
  );
  createCheckBox(
    container,
    'scale',
    function (e) {
      config.gauge[0].scale.visible = _getChecked(e);
      chart.load(config);
    },
    true
  );
  createCheckBox(
    container,
    'scale.line',
    function (e) {
      config.gauge[0].scale.line = _getChecked(e);
      chart.load(config);
    },
    true
  );
  createCheckBox(
    container,
    'scale.tick',
    function (e) {
      config.gauge[0].scale.tick = _getChecked(e);
      chart.load(config);
    },
    true
  );
  createListBox(
    container,
    'scale.gap',
    ['0', '4', '8', '12'],
    function (e) {
      config.gauge[0].scale.gap = _getValue(e);
      chart.load(config);
    },
    '8'
  );
  createCheckBox(
    container,
    'scale.opposite',
    function (e) {
      config.gauge[0].scale.position = _getChecked(e) ? 'opposite' : 'default';
      chart.load(config);
    },
    false
  );
  line(container);
  createCheckBox(
    container,
    'reversed2',
    function (e) {
      config.gauge[1].reversed = _getChecked(e);
      chart.load(config);
    },
    false
  );
  createListBox(
    container,
    'label2.position',
    ['', 'left', 'right', 'top', 'bottom'],
    function (e) {
      const pos = _getValue(e);
      config.gauge[1].label.position = pos;
      config.gauge[1].width = pos === 'left' || pos === 'right' ? 140 : 65;
      // config.gauge[0].label.text = (pos === 'left' || pos === 'bottom') ? 'RealChart Bullet ver 1.0' : 'RealChart Bullet<br>ver 1.0';
      chart.load(config);
    },
    ''
  );
  createCheckBox(
    container,
    'scale2',
    function (e) {
      config.gauge[1].scale.visible = _getChecked(e);
      chart.load(config);
    },
    true
  );
  createCheckBox(
    container,
    'scale2.line',
    function (e) {
      config.gauge[1].scale.line = _getChecked(e);
      chart.load(config);
    },
    true
  );
  createCheckBox(
    container,
    'scale2.tick',
    function (e) {
      config.gauge[1].scale.tick = _getChecked(e);
      chart.load(config);
    },
    true
  );
  createListBox(
    container,
    'scale2.gap',
    ['0', '4', '8', '12'],
    function (e) {
      config.gauge[1].scale.gap = _getValue(e);
      chart.load(config);
    },
    '8'
  );
  createCheckBox(
    container,
    'scale2.opposite',
    function (e) {
      config.gauge[1].scale.position = _getChecked(e) ? 'opposite' : 'default';
      chart.load(config);
    },
    false
  );
}

function init() {
  console.log(RealChart.getVersion());
  // RealChart.setDebugging(true);
  RealChart.setLogging(true);

  chart = RealChart.createChart(document, 'realchart', config);
  setActions('actions');
}
