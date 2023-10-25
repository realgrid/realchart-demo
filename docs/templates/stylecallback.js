export const config = {
  title: 'Point Style Callback',
  options: {},
  xAxis: {
    categories: [ '쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도' ],
    title: { text: '일일 Daily fat' },
    tick: {},
    label: {},
    line: true
  },
  yAxis: { title: 'Vertical 수직축 Axis' },
  series: [
    {
      name: 'column1',
      pointLabel: { visible: true, position: 'inside', effect: 'outline' },
      pointStyleCallback: undefined,
      data: [
        11, 22, 15,  9,
        19, 13, 27, 15
      ]
    },
    {
      name: 'line1',
      type: 'line',
      pointLabel: true,
      color: 'blue',
      data: [
         9, 17, 19, 11,
        25, 10, 21, 11
      ],
      style: { strokeDasharray: '5' },
      marker: { style: { stroke: 'white', strokeDasharray: 'none' } },
      pointStyleCallback: undefined
    }
  ]
}
