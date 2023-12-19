export const config = {
  title: '년도별 서울시 평균 대기질 지수',
  options: {},
  xAxis: {
    title: '서울시',
    categories: [
      '2014', '2015',
      '2016', '2017',
      '2018', '2019',
      '2020'
    ],
    grid: { visible: true },
    label: {}
  },
  yAxis: {
    title: '대기질 지수<br><t style="fill:gray;font-size:0.9em;">(Air Quality Index, AQI)</t>'
  },
  series: [
    {
      name: '대기질',
      pointLabel: true,
      data: [
        155, 138, 122,
        133, 114, 113,
        123
      ]
    }
  ]
}
