const config = {
  templates: {
    '@gauge': {
      circle: {
        width: '33%',
        height: '50%',
        innerRadius: '93%',
        scale: true,
        label: {
          numberFormat: '#0.0',
          style: {
            fontFamily: 'Arial',
            fontWeight: 'bold'
          },
          text: '<t style="fill:#262626">${value}</t><t style="font-size:24px;">%</t>'
        }
      }
    }
  },
  title: 'Circle Gauge',
  gauge: [{
    left: 0,
    value: 72,
    valueRim: {
      ranges: [{
        toValue: 30,
        color: '#0098ff'
      }, {
        toValue: 70,
        color: '#66d0ff'
      }, {
        color: '#ff5c35'
      }]
    },
    band: {
      visible: true,
      ranges: [{
        toValue: 30,
        color: '#0098ff'
      }, {
        toValue: 70,
        color: '#66d0ff'
      }, {
        color: '#ff5c35'
      }]
    }
  }, {
    left: '33%',
    value: 57,
    valueRim: {
      ranges: [{
        toValue: 30,
        color: 'blue'
      }, {
        toValue: 70,
        color: '#66d0ff'
      }, {
        color: '#ff5c35'
      }]
    },
    band: {
      visible: true,
      ranges: [{
        toValue: 30,
        color: '#0098ff'
      }, {
        toValue: 70,
        color: '#66d0ff'
      }, {
        color: '#ff5c35'
      }]
    }
  }, {
    left: '66%',
    value: 23,
    valueRim: {
      ranges: [{
        toValue: 30,
        color: '#0098ff'
      }, {
        toValue: 70,
        color: '#66d0ff'
      }, {
        color: '#ff5c35'
      }]
    },
    band: {
      visible: true,
      ranges: [{
        toValue: 30,
        color: '#0098ff'
      }, {
        toValue: 70,
        color: '#66d0ff'
      }, {
        color: '#ff5c35'
      }]
    }
  }]
};
let chart;
function init() {
  console.log(RealChart.getVersion());
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}