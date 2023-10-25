export const config = {
  options: {},
  title: 'Ohlc Series',
  xAxis: { type: 'category' },
  yAxis: { yBase: null },
  series: {
    type: 'ohlc',
    pointLabel: true,
    data: [
      [ 301, 348, 395, 465 ],
      [ 353, 439, 480, 580 ],
      [ 262, 370, 317, 418 ],
      [ 302, 326, 371, 450 ],
      [ 336, 382, 364, 420 ],
      [ 341, 356, 381, 430 ]
    ]
  }
}
