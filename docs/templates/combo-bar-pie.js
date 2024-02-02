export const config = {
  title: 'Bar & Pie Series',
  options: {},
  xAxis: {
    title: '일일 Daily fat',
    categories: [ '성남시', '용인시', '수원시', '일산시', '화성시', '평택시' ],
    grid: true
  },
  yAxis: { title: 'Vertical 수직축 Axis' },
  series: [
    {
      name: 'bar1',
      pointLabel: true,
      visibleInLegend: false,
      data: [ 11, 13, 10, 15, 19, 22 ]
    },
    {
      type: 'pie',
      centerX: '15%',
      centerY: '25%',
      radius: '20%',
      pointLabel: true,
      legendByPoint: true,
      data: [
        [ '성남시', 11 ],
        [ '용인시', 13 ],
        [ '수원시', 10 ],
        [ '일산시', 15 ],
        [ '화성시', 19 ],
        [ '평택시', 22 ]
      ]
    }
  ]
}
export const tool = false