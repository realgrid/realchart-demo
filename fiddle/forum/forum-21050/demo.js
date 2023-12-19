const config = {
  title: '한국가스공사 월간 시도별 도시가스 판매현황',
  options: {},
  xAxis: {
    title: '시도별',
    categories: ['강원', '서울', '경기', '인천', '부산', '경북'],
    grid: true
  },
  yAxis: {
    title: 'Vertical 수직축 Axis'
  },
  legend: {
    location: 'plot',
    align: 'right'
  },
  tooltip: {
    offset: 30
  },
  series: [{
    name: '2019년도',
    pointLabel: true,
    data: [413340, 4295799, 4582903, 1504513, 1428640, 1495929]
  }, {
    name: '2020년도',
    // groupWidth: 2,
    pointWidth: 2,
    pointLabel: true,
    data: [416570, 4180225, 5236434, 1393145, 1408886, 1479257]
  }, {
    name: '2021년도',
    pointLabel: true,
    data: [459931, 4201860, 5498483, 1472529, 1316482, 1421999]
  }]
};
const chart = RealChart.createChart(document, 'realchart', config);