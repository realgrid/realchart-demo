/**
 * @demo
 *
 */
const config = {
  templates: {
    vert: {
      vertical: true,
      width: 80
    },
    horz: {
      vertical: false,
      height: 80
    }
  },
  title: 'Linear Gauge',
  options: {},
  gauge: [{
    template: "vert",
    type: 'linear',
    name: 'gauge',
    label: {
      numberFormat: '#.#',
      style: {
        fill: 'var(--color-1)'
      }
    },
    scale: {
      visible: true,
      stepInterval: 20
    },
    value: Math.random() * 100,
    valueBar: {
      style: {
        fill: 'var(--color-1)'
      }
    },
    style: {
      fill: 'var(--color-2)'
    }
  }]
};
let animate;
let chart;
function init() {
  console.log(RealChart.getVersion());
  // RealChart.setDebugging(true);
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}