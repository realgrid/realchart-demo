export const config = {
  options: {},
  title: 'Linear Axis',
  xAxis: { title: 'X Axis', tick: {}, label: {} },
  yAxis: { title: 'Y Axis', tick: {}, label: {} },
  series: {
    type: 'bubble',
    colorByPoint: true,
    pointLabel: {
      visible: true,
      effect: 'outline',
      suffix: '%',
      style: { fill: '#008' }
    },
    pointColors: [
      '#ddd', '#ccc',
      '#bbb', '#aaa',
      '#999', '#888',
      '#777', '#666'
    ],
    data: [
      [ 9, 2381, 63 ],   [ 98, 7395, 89 ],
      [ 51, 5550, 73 ],  [ 41, 9922, 14 ],
      [ 58, 5824, 20 ],  [ 78, 2737, 34 ],
      [ 55, 15556, 53 ], [ 18, 9845, 70 ],
      [ 42, 7744, 28 ],  [ 3, 5652, 59 ],
      [ 31, 5318, 97 ],  [ 79, 11391, 63 ],
      [ 93, 12323, 23 ], [ 44, 13383, 22 ]
    ]
  }
}
export const tool = false