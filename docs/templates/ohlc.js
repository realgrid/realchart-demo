export const config = {
  options: {},
  title: 'Ohlc Series',
  xAxis: { type: 'category' },
  yAxis: { yBase: null },
  series: {
    type: 'ohlc',
    pointLabel: true,
    tooltipText: 'open: ${open}<br>High: ${high}<br>Low: ${low}<br>Close: ${close}',
    data: [
      { low: 301, open: 348, close: 395, high: 465, color: 'green' },
      [ 353, 439, 480, 580 ],
      [ 262, 370, 317, 418 ],
      [ 302, 326, 371, 450 ],
      [ 336, 382, 364, 420 ],
      [ 341, 356, 381, 430 ]
    ]
  }
}
export const tool = false