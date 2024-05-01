/**
 * @demo
 *
 */
const config = {
  templates: {
    gauge: {
      clockwise: !false,
      label: {
        numberFormat: '#00.#',
      },
    },
  },
  options: {
    palette: 'unicorn',
  },
  title: 'Circle Gauge Group',
  body: {
    annotations: [
      {
        type: 'image',
        front: true,
        width: 100,
        anchor: 'gaugeGroup',
        imageUrl: '../assets/images/동전.png'
      }
    ],
  },
  gauge: [
    {
      name: 'gaugeGroup',
      colorByPoints: true,
      children: [
        {
          name: 'gauge1',
          template: 'gauge',
          value: Math.random() * 100,
          valueRim: {
            style: {
              fill: 'var(--color-1)',
            },
          },
          rim: {
            style: {
              // fill: 'yellow',
            },
          },
          label: {
            style: {
              fill: 'var(--color-1)',
            },
            text: "<t style='fill:gray'>Time -</t> ${value}",
          },
        },
        {
          name: 'gauge2',
          template: 'gauge',
          value: Math.random() * 100,
          valueRim: {
            style: {
              fill: 'var(--color-2)',
            },
          },
          label: {
            style: {
              fill: 'var(--color-2)',
            },
            text: "<t style='fill:gray'>Run -</t> ${value}",
          },
        },
        {
          name: 'gauge3',
          template: 'gauge',
          value: Math.random() * 100,
          valueRim: {
            style: {
              fill: 'var(--color-3)',
            },
          },
          label: {
            style: {
              fill: 'var(--color-3)',
            },
            text: "<t style='fill:gray'>Walk -</t> ${value}",
          },
        },
        {
          name: 'gauge4',
          template: 'gauge',
          value: Math.random() * 100,
          valueRim: {
            style: {
              fill: 'var(--color-4)',
            },
          },
          label: {
            style: {
              fill: 'var(--color-4)',
            },
            text: "<t style='fill:gray'>Kcal -</t> ${value}",
          },
        },
      ],
      innerRadius: '30%',
      sweepAngle: 270,
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
      config.gauge.label.animatable = _getChecked(e);
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
    'dark'
  );
}

function init() {
  console.log(RealChart.getVersion());
  // RealChart.setDebugging(true);

  chart = RealChart.createChart(document, 'realchart', config);
  setActions('actions');
}
