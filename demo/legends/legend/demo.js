const config = {
  title: "Legends",
  xAxis: {
    title: "일일 Daily fat",
    categories: ['쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도'],
    grid: true
  },
  yAxis: {
    title: "Vertical 수직축 Axis"
  },
  series: [{
    name: 'column1',
    pointLabel: true,
    data: [11, 22, 15, 9, 13, 27]
  }, {
    name: 'column2',
    pointLabel: true,
    data: [15, 19, 19, 6, 21, 21]
  }, {
    name: 'line1',
    type: 'line',
    pointLabel: true,
    data: [13, 17, 15, 11, 23, 17]
  }, {
    name: 'line2',
    type: 'line',
    pointLabel: true,
    data: [15, 19, 13, 15, 20, 15]
  }],
  legend: {}
};
const chart = RealChart.createChart(document, 'realchart', config);