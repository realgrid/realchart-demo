/**
 * @demo
 *
 */
const config = {
  title: 'Linear Gauge - Band',
  gauge: [
    {
      type: 'linear',
      name: 'gauge',
      vertical: true,
      scale: false,
      width: 80,
      band: {
        visible: true,
        gap: 3,
        ranges: [
          {
            toValue: 30,
            color: '#ff0',
          },
          {
            toValue: 60,
            color: '#fa0',
          },
          {
            color: '#f40',
          },
        ],
      },
      value: Math.random() * 100,
      valueBar: {
        style: {
          fill: 'var(--color-1)',
        },
      },
      label: {
        numberFormat: '#.#',
        style: {
          fill: 'var(--color-1)',
        },
      },
      style: {
        fill: 'var(--color-2)',
      },
    },
  ],
};

let animate;
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
    'label.animatable',
    function (e) {
      config.gauge[0].label.animatable = _getChecked(e);
      chart.load(config);
    },
    true
  );
  createButton(container, 'Run', function (e) {
    clearInterval(timer);
    timer = setInterval(() => {
      for (let i = 1; i <= 4; i++) {
        chart.getGauge('gauge' + i).setValue(Math.random() * 100);
      }
    }, 2000);
  });
  createButton(container, 'Stop', function (e) {
    clearInterval(timer);
  });
  createListBox(
    container,
    'options.theme',
    ['', 'dark'],
    function (e) {
      config.options.theme = _getValue(e);
      chart.load(config, animate);
    },
    'default'
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
  createListBox(
    container,
    'scale.position',
    ['default', 'opposite'],
    function (e) {
      config.gauge[0].scale.position = _getValue(e);
      chart.load(config);
    },
    'default'
  );
  createCheckBox(
    container,
    'band',
    function (e) {
      config.gauge[0].band.visible = _getChecked(e);
      chart.load(config);
    },
    true
  );
  createListBox(
    container,
    'band.position',
    ['default', 'opposite', 'inside'],
    function (e) {
      config.gauge[0].band.position = _getValue(e);
      chart.load(config);
    },
    'default'
  );
}

function init() {
  console.log(RealChart.getVersion());
  // RealChart.setDebugging(true);
  RealChart.setLogging(true);

  chart = RealChart.createChart(document, 'realchart', config);
  setActions('actions');
}
