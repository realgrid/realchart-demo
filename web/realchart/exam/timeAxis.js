const config = {
  title: "Boundary",
  xAxis: {
    type: "time",
    // minPadding: 0,
    // maxPadding: 0,
    tick: {
      visible: true,
    },
  },
  series: [
    {
      name: "column",
      data: [1, 2, 3, 4],
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
    // alert('hello');
  });
  createListBox(
    container,
    'options.theme',
    ['', 'dark'],
    function (e) {
      config.options.theme = _getValue(e);
      chart.load(config);
    },
    'default'
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
  createCheckBox(
    container,
    'Zooming',
    function (e) {
      _getChecked(e) ? chart.xAxis.zoom(10.2, 20.4) : chart.xAxis.resetZoom();
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
