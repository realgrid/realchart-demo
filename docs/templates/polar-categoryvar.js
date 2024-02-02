export const config = {
  polar: true,
  options: {},
  title: 'Polar - Variable Category',
  xAxis: {
    categories: [
      { name: '성남시' },
      { name: '용인시', weight: 1.5 },
      { name: '수원시' },
      { name: '일산시', weight: 2 },
      { name: '화성시' },
      { name: '평택시' }
    ],
    categories2: [
      { name: '성남시' },
      { name: '용인시' },
      { name: '수원시' },
      { name: '일산시' },
      { name: '화성시' },
      { name: '평택시' }
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
export const tool = false