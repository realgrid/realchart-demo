const config = {
  title: "Treemap",
  xAxis: {},
  yAxis: {},
  series: {
    type: 'treemap',
    // startDir: 'vertical',
    algorithm: 'squarify',
    // algorithm: 'sliceDice',
    // algorithm: 'slice',
    pointLabel: {
      visible: true,
      text: '${x}',
      effect: 'outline',
      style: {}
    },
    data: [{
      "name": "A",
      "value": 6
    }, {
      "name": "B",
      "value": 5
    }, {
      "name": "C",
      "value": 4
    }, {
      "name": "D",
      "value": 3
    }, {
      "name": "E",
      "value": 2
    }, {
      "name": "F",
      "value": 2
    }, {
      "name": "G",
      "value": 1
    }, {
      "name": "H",
      "value": 1
    }, {
      "name": "I",
      "value": 1
    }],
    style: {}
  }
};
const chart = RealChart.createChart(document, 'realchart', config);