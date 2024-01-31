export const config = {
  options: {},
  title: 'Time Axis',
  xAxis: {
    type: 'time',
    title: 'Time',
    crosshair: true,
    padding: 0
  },
  yAxis: { title: 'Hestavollane' },
  series: {
    type: 'line',
    marker: {
      visible: true,
      shape: 'diamond',
      radius: 5,
      style: { stroke: 'white' }
    },
    xStart: '2023-07-12',
    xStep: 3600000,
    data: [
      4.5, 5.1, 4.4, 3.7, 4.2, 3.7,
      4.3,   4,   5, 4.9, 4.8, 4.6,
      3.9, 3.8, 2.7, 3.1, 2.6, 3.3,
      3.8, 4.1,   1, 1.9, 3.2, 3.8,
      4.2
    ]
  },
  tooltip: { timeFormat: 'yyyy-MM-dd HH:mm' }
}
export const tool = false