/**
 * @demo
 *
 */

config = {
  title: 'Boundary',
  xAxis: {
  
  },
  yAxis: {
      type: 'log',
      grid: {
          visible: true,
          rows:{
              belowColor: "red",
              // colors: ['red', 'orange', 'yellow']
          }
      },
      baseValue: 2
  },
  series: {
      name: 'column1',
      data: [1, 2, 3, 4],
      baseValue: 2
  }
};
let animate;
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
  createCheckBox(
    container,
    'Always Animate',
    function (e) {
      animate = _getChecked(e);
    },
    false
  );
  createButton(container, 'Test', function (e) {
    alert('hello');
  });
  createListBox(
    container,
    'X.startOffset',
    ['0', '0.5'],
    function (e) {
      config.xAxis.startOffset = _getValue(e);
      chart.load(config);
    },
    '0'
  );
  createCheckBox(
    container,
    'body.circular',
    function (e) {
      config.body.circular = _getChecked(e);
      chart.load(config, animate);
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
