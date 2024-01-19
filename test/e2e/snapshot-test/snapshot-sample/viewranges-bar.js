export const config = {
  vars: {},
  title: 'View Ranges - Bar',
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
    type: 'bar',
    pointLabel: true,
    baseValue: 0,
    data: [
      155, 138, 122, 133,
      114, 113, 123, 119,
      125, 131
    ],
    viewRangeValue: 'x',
    viewRanges: [
      { toValue: 3, color: 'blue' },
      { toValue: 6, color: '#dddd00' },
      { color: 'red' }
    ],
    style: { fillOpacity: 0.5 }
  },
  tooltip: false,
  ChartTextEffect: { autoContrast: false }
}
