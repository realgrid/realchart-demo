export const config = {
  templates: { series: { data: [ 11, 13, 10, 15, 19, 22 ] } },
  title: 'Line & Lollipop Series',
  options: {},
  xAxis: {
    title: '일일 Daily fat',
    categories: [ '`14', '`15', '`16', '`17', '`18', '`19' ]
  },
  yAxis: { title: 'Vertical 수직축 Axis' },
  legend: true,
  series: [
    { template: 'series', type: 'line', pointLabel: true },
    {
      template: 'series',
      type: 'lollipop',
      visibleInLegend: false,
      style: { fill: 'none', strokeWidth: '1px' }
    }
  ]
}
export const tool = false