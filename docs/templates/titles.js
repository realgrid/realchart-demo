export const config = {
  title: { text: 'Chart Title', style: { textDecoration: 'underline' } },
  subtitle: { text: 'Sub Title', style: { fill: 'red' } },
  xAxis: { title: 'X Axis', grid: true },
  yAxis: { title: 'Y Axis' },
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
