export const config = {
  options: {},
  title: 'Log Axis',
  xAxis: { type: 'log' },
  yAxis: { type: 'log' },
  series: {
    type: 'line',
    data: [
       1,  2,   4,   8,  16,
      32, 64, 128, 256, 512
    ]
  }
}
export const tool = false