export const config = {
  options: {},
  title: 'Axis Guides',
  xAxis: { title: 'X Axis', grid: true },
  yAxis: {
    title: 'Y Axis',
    guide: [
      { type: 'line', value: 12, label: 'line guide' },
      {
        type: 'range',
        start: 3,
        end: 6,
        label: { text: 'range guide', align: 'right', style: { fill: 'red' } }
      }
    ]
  },
  series: {
    pointLabel: { visible: true, position: 'head', effect: 'outline', style: {} },
    data: [
      [ 'home', 7 ],
      [ 'sky', 11 ],
      [ 'def', 9 ],
      [ '지리산', 14.3 ],
      [ 'zzz', 13 ],
      [ '낙동강', 12.5 ]
    ],
    style: {}
  }
}
