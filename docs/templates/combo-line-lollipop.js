export const config = {
  templates: {
    series: {
      data: [
        11, 13, 10, 15,
        19, 22, 27
      ]
    }
  },
  title: 'Line & Lollipop Series',
  options: {},
  xAxis: {
    title: '일일 Daily fat',
    categories: [ '쓰리엠', '아디다스', 'Youtube', '디즈니', '이마트', '메리어트', '시세이도' ]
  },
  yAxis: { title: 'Vertical 수직축 Axis' },
  legend: true,
  series: [
    { template: 'series', type: 'line', pointLabel: true },
    {
      template: 'series',
      type: 'lollipop',
      visibleInLegend: false,
      style: { fill: 'none', strokeWidth: '1px', strokeDasharray: '4' }
    }
  ]
}
