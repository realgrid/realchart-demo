const config = {
  options: {},
  title: "Bar Group",
  xAxis: {
    title: "일일 Daily fat",
    categories: ['쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도'],
    grid: true
  },
  yAxis: {
    title: "Vertical 수직축 Axis"
  },
  series: [{
    groupPadding: 0.1,
    // layout: 'overlap',
    // layout: 'stack',
    series: [{
      name: 'column1',
      // pointWidth: '100%',
      data: [11, 22, 15, 9, 13, 27]
    }, {
      name: 'column2',
      data: [15, 19, 19, 6, 21, 21]
    }, {
      name: 'column3',
      data: [13, 17, 15, 11, 23, 17]
    }]
  }, {
    groupPadding: 0.1,
    // layout: 'overlap',
    layout: 'stack',
    series: [{
      group: 1,
      name: 'column4',
      data: [13, 17, 15, 11, 23, 17]
    }, {
      group: 1,
      name: 'column5',
      data: [15, 19, 19, 6, 21, 21]
    }]
  }]
};
const chart = RealChart.createChart(document, 'realchart', config);