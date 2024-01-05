/**
 * @demo
 *
 */
const config = {
  templates: {
    gauge: {
      label: {
        numberFormat: '#.#',
      },
    },
  },
  title: 'Linear Gauge Group',
  gauge: [
    {
      type: 'lineargroup',
      width: '80%',
      height: 250,
      maxValue: 100,
      children: [
        {
          name: 'gauge1',
          template: 'gauge',
          value: Math.random() * 100,
          label: {
            style: {
              fill: 'var(--rct-linear-gauge-value-fill)',
            },
          },
        },
        {
          name: 'gauge2',
          template: 'gauge',
          value: Math.random() * 100,
          valueBar: {
            style: {
              fill: 'var(--color-2)',
            },
          },
          label: {
            style: {
              fill: 'var(--color-2)',
            },
          },
        },
        {
          name: 'gauge3',
          template: 'gauge',
          value: Math.random() * 100,
          valueBar: {
            style: {
              fill: 'var(--color-3)',
            },
          },
          label: {
            style: {
              fill: 'var(--color-3)',
            },
          },
        },
        {
          name: 'gauge4',
          template: 'gauge',
          value: Math.random() * 100,
          valueBar: {
            style: {
              fill: 'var(--color-4)',
            },
          },
          label: {
            style: {
              fill: 'var(--color-4)',
            },
          },
        },
      ],
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
    false
  );
  createListBox(
    container,
    'band.position',
    ['default', 'opposite'],
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
