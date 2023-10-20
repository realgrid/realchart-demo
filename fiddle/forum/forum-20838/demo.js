const config = {
  title: '2022년도 도시의 평균 대기질 지수',
  options: {},
  xAxis: {
    title: '도시',
    categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020'],
    grid: true,
    label: {
      step: 3
    }
  },
  yAxis: {
    title: '대기질 지수(Air Quality Index, AQI)'
  },
  series: {
    name: '대기질',
    pointLabel: true,
    data: [155, 138, 122, 130, 119, 115, 128]
  },
  ChartTextEffect: {
    autoContrast: false
  }
};
const chart = RealChart.createChart(document, 'realchart', config);