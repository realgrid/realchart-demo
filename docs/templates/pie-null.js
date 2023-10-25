export const config = {
  title: 'Pie Series - Null',
  options: {},
  legend: { position: 'right', style: { marginRight: '20px' } },
  xAxis: {},
  yAxis: {},
  plot: {},
  series: {
    type: 'pie',
    legendByPoint: true,
    pointLabel: { visible: true, text: '${name} (${y})', style: {} },
    data: [
      { name: 'moon', y: 53, sliced: true },
      { name: 'yeon', y: null },
      { name: 'lim', y: 17 },
      { name: 'moon', y: 9 },
      { name: 'hong', y: 13 },
      { name: 'america', y: 23 },
      { name: 'asia', y: 29 }
    ]
  }
}
