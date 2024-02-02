export const config = {
  options: { animatable: false },
  title: 'Axis Guides',
  legend: true,
  xAxis: {
    tick: true,
    categories: [ '성남시', '용인시', '수원시', '일산시', '화성시', '평택시' ],
    title: 'X Axis',
    grid: true
  },
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
    data: [ 11, 22, 15, 9, 13, 27 ],
    style: {}
  }
}
export const tool = false