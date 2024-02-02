export const config = {
  title: 'Category Axis',
  options: {},
  xAxis: {
    categories: [ '성남시', '용인시', '수원시', '일산시', '화성시', '평택시' ],
    title: { text: '일일 Daily fat' },
    tick: {},
    label: {},
    grid: true,
    line: true
  },
  yAxis: { title: 'Vertical 수직축 Axis' },
  series: [
    {
      name: 'column1',
      color: 'green',
      pointLabel: { visible: true, position: 'inside', effect: 'outline' },
      data: [ 11, 22, 15, 9, 13, 27 ]
    },
    {
      name: 'line1',
      type: 'line',
      pointLabel: { visible: true, effect: 'outline' },
      color: 'black',
      data: [ 9, 17, 19, 11, 10, 21 ],
      style: { strokeDasharray: '5' },
      marker: { style: {} }
    }
  ]
}
export const tool = false