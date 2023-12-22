const config = {
  title: '2022년도 도시의 평균 대기질 지수',
  xAxis: {
    title: '수정구',
    categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020'],
    grid: true,
    label: {
      step: 3
    }
  },
  yAxis: {
    title: '대기질 지수(Air Quality Index, AQI)',
    guide: [{
      type: 'line',
      value: 130,
      label: '130'
    }]
  },
  series: {
    name: '대기질',
    pointLabel: true,
    data: [['신흥1동', 155], ['신흥2동', 138], ['신흥3동', 122], ['태평1동', 133], ['태평2동', 114], ['태평3동', 113], ['태평4동', 123]]
  }
};
let animate = false;
let chart;
function init() {
  chart = RealChart.createChart(document, 'realchart', config);
}