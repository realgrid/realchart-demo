export const config = {
  title: {
    text: 'Chart Title',
    style: { fill: 'white' },
    backgroundStyle: { fill: '#333', padding: '1px 4px', rx: '4' }
  },
  subtitle: {
    text: '2023.01 World Bank.',
    style: { fill: 'gray', fontStyle: 'italic' }
  },
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
