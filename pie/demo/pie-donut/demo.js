const config = {
  title: "Donut Series",
  options: {},
  legend: {
    position: 'inside',
    style: {
      marginRight: '20px'
    }
  },
  xAxis: {},
  yAxis: {},
  series: {
    type: 'pie',
    innerSize: '50%',
    //innerText: 'Inner Title',
    innerText: '내부 타이틀<br><t style="fill:blue;font-weight:bold;">Inner</t><t style="fill:red;">Title</t>',
    pointLabel: {
      visible: true,
      effect: 'outline',
      style: {}
    },
    data: [{
      name: 'moon',
      y: 53
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