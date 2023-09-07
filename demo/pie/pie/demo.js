const config = {
  title: "Pie Series",
  legend: {
    position: 'right',
    layout: 'auto',
    style: {
      marginRight: '20px'
    }
  },
  xAxis: {},
  yAxis: {},
  series: {
    type: 'pie',
    pointLabel: {
      visible: true,
      effect: 'outline',
      style: {
        // fill: '#eee'
      }
    },
    data: [{
      name: 'moon',
      y: 53,
      sliced: true
    }, {
      name: 'yeon',
      y: 97,
      color: '#0088ff'
    }, {
      name: 'lim',
      y: 17
    }, {
      name: 'moon',
      y: 9
    }, {
      name: 'hong',
      y: 13
    }, {
      name: 'america',
      y: 23
    }, {
      name: 'asia',
      y: 29
    }
    // 23,
    // 7,
    // 17,
    // 13
    ]
  }
};
const chart = RealChart.createChart(document, 'realchart', config);