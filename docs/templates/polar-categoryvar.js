export const config = {
  polar: true,
  options: {},
  title: 'Polar - Variable Category',
  xAxis: {
    categories: [
      { name: '쓰리엠' },
      { name: '아디다스', weight: 1.5 },
      { name: '디즈니' },
      { name: '이마트', weight: 2 },
      { name: '메리어트' },
      { name: '시세이도' }
    ],
    categories2: [
      { name: '쓰리엠' },
      { name: '아디다스' },
      { name: '디즈니' },
      { name: '이마트' },
      { name: '메리어트' },
      { name: '시세이도' }
    ]
  },
  yAxis: {
    label: true,
    guide: [ { type: 'line', value: 5.5, style: { stroke: 'red' } } ]
  },
  body: {},
  series: [
    {
      type: 'bar',
      pointLabel: { visible: true, position: 'outside' },
      data: [ 7, 11, 9, 14.3, 13, 12.5 ]
    },
    {
      type: 'area',
      pointLabel: true,
      data: [ 13, 9, 11, 12.3, 11, 15.5 ]
    }
  ]
}
