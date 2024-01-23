export const config = {
  options: { animatable: false },
  title: 'Axis Guides',
  legend: true,
  xAxis: { tick: true, title: 'X Axis', grid: true },
  yAxis: {
    tick: true,
    title: 'Y Axis',
    guides: [
      {
        type: 'line',
        visible: false,
        value: 12,
        label: {
          text: 'line guide',
          effect: 'background',
          style: { fill: 'white' },
          backgroundStyle: { fill: 'black', padding: '2px 5px' }
        },
        style: { stroke: 'blue', strokeDasharray: '4' }
      },
      {
        type: 'range',
        front: true,
        startValue: 3,
        endValue: 6,
        style: { fill: '#008800' },
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
export const tool = false