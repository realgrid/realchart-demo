export const config = {
  title: 'Trendline',
  xAxis: {},
  yAxis: { startFit: 'value' },
  series: {
    trendline: { visible: true, type: 'linear', movingAverage: { interval: 2 } },
    data: [
       1.4,    2,  7.4, 10.8,
      11.4, 10.4, 22.8, 16.6,
        15,   12,  9.5,  4.2
    ]
  }
}
