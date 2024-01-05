/**
 * @demo
 */
const config = {
  options: {
    // animatable: false,
    credits: {
      // visible: false,
      // verticalAlign: 'top'
      // align: 'center'
    },
  },
  title: 'Linear Gauges',
  gauge: [
    {
      type: 'linear',
      name: 'linear1',
      width: '60%',
      height: 85,
      top: 100,
      // maxValue: 100,
      value: 81,
      valueBar: {
        style: {
          fill: 'blue',
        },
      },
      scale: {
        line: true,
      },
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
      label: {
        text: 'RealChart Linear<br>ver 1.0',
        // position: 'bottom',
        style: { fill: 'blue' },
      },
      style: {
        fill: 'red',
      },
    },
    {
      type: 'linear',
      name: 'linear2',
      width: '50%',
      height: 100,
      top: 250,
      // minValue: 30,
      // maxValue: 175,
      value: 81,
      valueBar: {
        styleCallback: (args) => {
          if (args.value < 40) return { fill: 'red' };
          else if (args.value < 60) return { fill: 'yellow' };
        },
      },
      scale: {
        line: true,
      },
      ranges: [
        {
          toValue: 50,
          color: '#777',
        },
        {
          toValue: 70,
          color: '#aaa',
        },
      ],
      label: {
        position: 'top',
        text: 'RealChart Linear ver 1.0',
      },
      // style: {
      //     fill: 'blue'
      // },
      paneStyle: {
        stroke: 'lightblue',
      },
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
  // createButton(container, 'Run', function(e) {
  //     config.gauge.active = true;
  //     chart.load(config);
  // });
  // createButton(container, 'Stop', function(e) {
  //     config.gauge.active = false;
  //     chart.load(config);
  // });
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
    ['', 'left', 'right'],
    function (e) {
      config.gauge[0].label.position = _getValue(e);
      chart.load(config);
    },
    ''
  );
  createListBox(
    container,
    'label.gap',
    ['0', '5', '10', '3%', '5%', '7%'],
    function (e) {
      config.gauge[0].label.gap = _getValue(e);
      chart.load(config);
    },
    '5%'
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
    ['default', 'opposite', 'inside'],
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
    ['default', 'opposite', 'inside'],
    function (e) {
      config.gauge[0].band.position = _getValue(e);
      chart.load(config);
    },
    'default'
  );
  line(container);
  createListBox(
    container,
    'label2.position',
    ['top', 'bottom'],
    function (e) {
      config.gauge[1].label.position = _getValue(e);
      chart.load(config);
    },
    'top'
  );
  createListBox(
    container,
    'scale2.position',
    ['default', 'opposite', 'inside'],
    function (e) {
      config.gauge[1].scale.position = _getValue(e);
      chart.load(config);
    },
    'default'
  );
  createButton(container, 'Run', function (e) {
    clearInterval(timer);
    timer = setInterval(() => {
      chart.gauge.setValue(Math.random() * 100);
      chart.getGauge('linear2').setValue(Math.random() * 100);
    }, 2000);
  });
  createButton(container, 'Stop', function (e) {
    clearInterval(timer);
  });
}

function init() {
  console.log(RealChart.getVersion());
  // RealChart.setDebugging(true);
  RealChart.setLogging(true);

  chart = RealChart.createChart(document, 'realchart', config);
  setActions('actions');
}
