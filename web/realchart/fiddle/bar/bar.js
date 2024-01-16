/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
  title: '연도별 서울시 평균 대기질 지수',
  options: {},
  inverted: false,
  xAxis: {
    title: '서울시',
    categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020'],
    grid: {
      visible: true,
    },
    label: {},
    reversed: false,
  },
  yAxis: {
    title:
      '대기질 지수<br><t style="fill:gray;font-size:0.9em;">(Air Quality Index, AQI)</t>',
    reversed: false,
  },
  series: [
    {
      name: '대기질',
      pointLabel: true,
      data: [155, 138, 122, 133, 114, 113, 123],
    },
  ],
};

let animate = false;
let chart;

function init() {
  RealChart.setLogging(true);

  chart = RealChart.createChart(document, 'realchart', config);
}
