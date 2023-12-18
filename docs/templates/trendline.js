export const config = {
  title: 'Trendline',
  xAxis: {},
  yAxis: {},
  series: {
    type: 'line',
    trendline: { visible: true, type: 'linear', movingAverage: { interval: 4 } },
    data: [
       5,  7, 11, 9,  3,  6,  9,
      15,  4,  6, 8, 10, 15, 17,
      11, 19, 18
    ]
  }
}
