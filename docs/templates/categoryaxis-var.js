export const config = {
  title: 'Variable Category Axis',
  options: {},
  xAxis: {
    title: '일일 Daily fat',
    categories: [
      { name: '쓰리엠' },
      { name: '아디다스', weight: 1.5 },
      { name: '디즈니' },
      { name: '이마트', weight: 2 },
      { name: '메리어트' },
      { name: '시세이도' }
    ],
    grid: true
  },
  yAxis: { title: 'Vertical 수직축 Axis' },
  series: [
    {
      name: 'column1',
      pointLabel: { visible: true, position: 'inside', effect: 'outline' },
      data: [ 11, 22, 15, 9, 13, 27 ]
    },
    {
      name: 'line1',
      type: 'line',
      pointLabel: true,
      color: 'black',
      data: [ 9, 17, 19, 11, 10, 21 ],
      style: { strokeDasharray: '5' }
    }
  ]
}
export const tool = false