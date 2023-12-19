export const config = {
  options: {},
  title: 'Equalizer Null Point',
  xAxis: { title: 'X Axis' },
  yAxis: { title: 'Y Axis' },
  series: {
    type: 'equalizer',
    pointLabel: { visible: true, effect: 'outline', style: {} },
    data: [
      [ 'home', 10 ],
      [ 'sky', null ],
      [ 'def', 9 ],
      [ '지리산', 14.3 ],
      [ 'zzz', 13 ],
      [ '낙동강', 12.5 ]
    ],
    style: {}
  }
}
