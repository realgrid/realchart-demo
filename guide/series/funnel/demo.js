const config = {
  title: "Funnel Series",
  legend: {
    position: 'right',
    style: {
      marginTop: '16px',
      marginRight: '20px'
    }
  },
  xAxis: {},
  yAxis: {},
  series: [{
    type: 'funnel',
    tooltipText: 'height: ${height}',
    pointLabel: {
      visible: true,
      text: "${name} (${y})",
      position: "outside"
    },
    legendByPoint: true,
    data: [{
      name: '웹사이트 방문',
      y: 13293
    }, {
      name: '장바구니 담기',
      y: 4729
    }, {
      name: '결제제페이지',
      y: 2742
    }, {
      name: '구매 완료',
      y: 1391
    }]
  }]
};
let animate = false;
let chart;
function init() {
  chart = RealChart.createChart(document, 'realchart', config);
}