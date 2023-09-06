const config = {
  title: "Bar Series",
  options: {
    // animatable: false
  },
  xAxis: {
    title: "일일 Daily fat",
    categories: ['쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도'],
    grid: true
  },
  yAxis: {
    title: "Vertical 수직축 Axis"
    // reversed: true,
    // baseValue: -1
  },

  series: {
    name: 'bar1',
    // baseValue: null,
    pointLabel: true,
    // pointWidth: '100%',
    data: [11, 22, 15, 9, 13, 27]
  }
};
const chart = RealChart.createChart(document, 'realchart', config);