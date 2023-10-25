export const config = {
  title: 'Bar & Pie Series',
  options: {},
  xAxis: {
    title: '일일 Daily fat',
    categories: [ '쓰리엠', '아디다스', 'Youtube', '디즈니', '이마트', '메리어트', '시세이도' ],
    grid: true
  },
  yAxis: { title: 'Vertical 수직축 Axis' },
  series: [
    {
      name: 'bar1',
      pointLabel: true,
      displayInLegend: false,
      data: [
        11, 13, 10, 15,
        19, 22, 27
      ]
    },
    {
      type: 'pie',
      centerX: '15%',
      centerY: '25%',
      radius: '20%',
      pointLabel: true,
      legendByPoint: true,
      data: [
        [ '쓰리엠', 11 ],
        [ '아디다스', 13 ],
        [ 'Youtube', 10 ],
        [ '디즈니', 15 ],
        [ '이마트', 19 ],
        [ '메리어트', 22 ],
        [ '시세이도', 27 ]
      ]
    }
  ]
}
