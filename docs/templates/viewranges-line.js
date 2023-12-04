export const config = {
  vars: {},
  title: 'View Ranges - Line',
  options: {},
  xAxis: {
    title: '서울시',
    categories: [
      '2014', '2015',
      '2016', '2017',
      '2018', '2019',
      '2020', '2021',
      '2022', '2023'
    ],
    grid: true
  },
  yAxis: { title: '대기질 지수(Air Quality Index, AQI)' },
  series: {
    type: 'line',
    pointLabel: true,
    baseValue: 0,
    data: [
      155, 138, 122, 133,
      114, 113, 123, 117,
      125, 131
    ],
    viewRangeValue: 'x',
    viewRanges: [
      { toValue: 3, color: 'blue' },
      { toValue: 6, color: '#555', style: { strokeDasharray: 4 } },
      { color: 'red' }
    ],
    style: { strokeWidth: '2px' }
  },
  ChartTextEffect: { autoContrast: false }
}
