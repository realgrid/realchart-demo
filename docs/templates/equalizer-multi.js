export const config = {
  type: 'equalizer',
  title: 'Multiple Equalizer',
  xAxis: {
    title: 'X Axis',
    categories: [ '쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도' ]
  },
  yAxis: { title: 'Y Axis' },
  series: [
    {
      pointLabel: { visible: true, effect: 'outline', style: {} },
      data: [ 11, 22, 15, 9, 13, 27 ],
      style: {}
    },
    {
      pointLabel: { visible: true, effect: 'outline', style: {} },
      data: [ 15, 19, 19, 6, 21, 21 ],
      style: {}
    }
  ]
}
