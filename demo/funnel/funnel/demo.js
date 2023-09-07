const config = {
  title: "Funnel Series",
  options: {},
  legend: {
    position: 'right',
    layout: 'vertical',
    style: {
      marginTop: '16px',
      marginRight: '20px'
    }
  },
  xAxis: {},
  yAxis: {},
  series: {
    type: 'funnel',
    pointLabel: {
      visible: true,
      style: {
        fill: '#eee'
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
    }]
  }
};
const chart = RealChart.createChart(document, 'realchart', config);