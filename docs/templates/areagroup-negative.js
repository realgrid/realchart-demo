export const config = {
  type: 'area',
  title: 'Area Group - Negative',
  options: {},
  xAxis: {
    title: '일일 Daily fat',
    categories: [
      '1일',  '2일',  '3일',  '4일',
      '5일',  '6일',  '7일',  '8일',
      '9일',  '10일', '11일', '12일',
      '13일', '14일', '15일', '16일',
      '17일', '18일', '19일', '20일',
      '21일', '22일', '23일', '24일',
      '25일', '26일', '27일', '28일',
      '29일', '30일'
    ]
  },
  yAxis: { title: 'Vertical 수직축 Axis' },
  series: [
    {
      children: [
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
          marker: {},
          style: { fill: '#66d0ff', stroke: 'none' }
        },
        {
          type: 'area',
          name: '12월 최고,최저 기온',
          belowStyle: { stroke: 'purple', fill: 'purple' },
          tooltipText: '${xValue}<br>최저온도 ${y}, 최고온도 ${low}',
          data: [
            [ 18.9 ], [ 22.9 ], [ 20.4 ], [ 17.5 ],
            [ 17.7 ], [ 12.9 ], [ 6.7 ],  [ 8.9 ],
            [ 12.1 ], [ 3.8 ],  [ 2.4 ],  [ 1.8 ],
            [ 2.25 ], [ 5 ],    [ 7 ],    [ 6.5 ],
            [ 2 ],    [ 0.3 ],  [ 6 ],    [ -1.8 ],
            [ 1.4 ],  [ -2.9 ], [ -1.9 ], [ -4.4 ],
            [ 2.9 ],  [ 4.1 ],  [ 1.4 ],  [ 2 ],
            [ 5.6 ],  [ 7.8 ]
          ],
          marker: {},
          style: { fill: '#66d0ff', stroke: 'none' }
        }
      ]
    }
  ]
}
export const tool = false