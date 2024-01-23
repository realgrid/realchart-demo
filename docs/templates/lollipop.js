export const config = {
  options: {},
  title: 'Lollipop Series',
  xAxis: { type: 'category', grid: true },
  yAxis: { title: 'Y Axis' },
  series: {
    type: 'lollipop',
    pointLabel: { visible: true, style: { fill: 'black' } },
    data: [
      [ 'home', 7 ],
      [ 'sky', 11 ],
      [ 'def', 9 ],
      [ '소홍', 10 ],
      [ '지리산', 14.3 ],
      [ 'zzz', 13 ],
      [ '낙동강', 12.5 ]
    ],
    style: {},
    marker: { style: {} }
  }
}
export const tool = false