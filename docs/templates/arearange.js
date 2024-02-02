export const config = {
  title: '2023년 11월 서울 최고,최저 기온',
  subtitle: { align: 'left', text: '출처: 웨더아이', style: { fill: '#AAA' } },
  options: {},
  xAxis: { type: 'time', title: 'Time', grid: true },
  yAxis: { title: 'Temparature', tick: true },
  series: [
    {
      type: 'area',
      name: '11월 최고,최저 기온',
      belowStyle: { stroke: 'red', fill: 'red' },
      tooltipText: '${xValue}<br>최저온도 ${y}, 최고온도 ${low}',
      data: [
        [ 17.2 ], [ 18.7 ], [ 17.7 ],
        [ 14.1 ], [ 15.1 ], [ 6.6 ],
        [ 3.6 ],  [ 1.8 ],  [ 5.9 ],
        [ 0.5 ],  [ -1.9 ], [ -2 ],
        [ -2.2 ], [ -0.8 ], [ 2 ],
        [ 5.7 ],  [ -1.9 ], [ -3.8 ],
        [ -0.3 ], [ 1.8 ],  [ 1.4 ],
        [ 2.9 ],  [ 1.9 ],  [ -4.4 ],
        [ -5.9 ], [ -0.1 ], [ 4.4 ],
        [ -3 ],   [ -5.6 ], [ -7.8 ]
      ],
      xStart: '2023-11-01',
      xStep: '1d',
      marker: {},
      style: { fill: '#66d0ff', stroke: 'none' }
    }
  ],
  tooltip: { followPointer: true }
}
export const tool = false