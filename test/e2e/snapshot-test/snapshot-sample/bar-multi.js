export const config = {
  title: '세종특별자치시 1인당 지방세 부담액',
  options: {},
  xAxis: {
    title: '년도',
    categories: [ '2017', '2018', '2019', '2020', '2021', '2022' ],
    grid: true,
    label: { step: 1 }
  },
  yAxis: { title: '인구수' },
  series: [
    {
      name: '주민1인당 부담금액',
      pointLabel: true,
      data: [ 237466, 213497, 195827, 223488, 235850, 224338 ]
    },
    {
      name: '인구수',
      pointLabel: true,
      data: [ 28010, 31412, 34057, 35583, 37189, 38359 ]
    }
  ]
}
