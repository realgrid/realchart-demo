const config = {
  options: {},
  title: "Circle Guage",
  gauge: {
    name: "gauge1",
    value: Math.random() * 100,
    rim: {},
    valueRim: {
      // stroked: true,
      ranges: [{
        toValue: 30,
        color: "green"
      }, {
        toValue: 70,
        color: "yellow"
      }, {
        color: "red"
      }],
      stroked: true,
      style: {
        strokeLinecap: "round" //// 이 부분입니다
      }
    },

    scale: {
      visible: true
    },
    band: {
      // thickness: '100%',
      visible: true,
      ranges: [{
        toValue: 20,
        color: "#8f0"
      }, {
        toValue: 40,
        color: "#8d0"
      }, {
        toValue: 60,
        color: "#5a0"
      }, {
        toValue: 80,
        color: "#480"
      }, {
        color: "#350"
      }]
    },
    label: {
      numberFormat: "#0.0",
      text: '<t style="fill:blue">${value}</t><t style="font-size:24px;">%</t><br><t style="font-size:20px;font-weight:normal">Gauge Test</t>',
      text2: '<t style="font-size:20px;font-weight:normal">Gauge Test</t><br><t style="fill:blue">${value}</t><t style="font-size:24px;">%</t>',
      style: {
        fontFamily: "Arial",
        fontWeight: "bold"
      }
    }
  }
};
const chart = RealChart.createChart(document, 'realchart', config);