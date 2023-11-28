export const config = {
  options: { animatable: false },
  title: 'Line Series 01',
  xAxis: { type: 'category' },
  yAxis: { strictMax: 15 },
  series: {
    type: 'line',
    marker: true,
    pointLabel: true,
    data: [
      [ 'home', 7 ],
      [ 'sky', 11 ],
      [ '카눈', 8 ],
      [ 'def', 9 ],
      [ '머핀', 11 ],
      [ '지리산', 15.3 ],
      [ 'zzz', 13 ],
      [ '낙동강', 12.5 ]
    ]
  }
}
