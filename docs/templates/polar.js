export const config = {
  polar: true,
  options: {},
  title: 'Polar Chart',
  xAxis: { categories: [ '성남시', '용인시', '수원시', '일산시', '화성시', '평택시' ] },
  yAxis: { label: true },
  body: {},
  series: [
    {
      type: 'bar',
      pointLabel: { visible: true, position: 'outside', style: { fill: '#00f' } },
      data: [ 7, 11, 9, 14.3, 13, 12.5 ]
    },
    {
      type: 'area',
      pointLabel: true,
      data: [ 13, 9, 11, 12.3, 11, 15.5 ]
    }
  ]
}
export const tool = { actions: [ { type: 'config.polar' } ] }