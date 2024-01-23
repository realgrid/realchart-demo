export const config = {
  type: 'line',
  options: { theme: 'real', palette: 'unicorn' },
  title: { text: 'xAxis', style: { fontSize: '48px', fontWeight: 'bold' } },
  split: { visible: true, rows: 4, col: 1 },
  xAxis: [
    {
      type: 'category',
      categories: [
        'A', 'B', 'C', 'D',
        'E', 'F', 'G', 'H',
        'I', 'J'
      ],
      tick: { visible: true },
      row: 0
    },
    {
      type: 'linear',
      tick: { visible: true, stepInterval: 1 },
      row: 1
    },
    {
      type: 'time',
      tick: { visible: true, stepInterval: '1m' },
      row: 2
    },
    { type: 'log', tick: { visible: true, stepInterval: 0.1 }, row: 3 }
  ],
  yAxis: [
    { template: 'yAxis', title: { text: 'category' } },
    { template: 'yAxis', row: 1, title: { text: 'linear' } },
    { template: 'yAxis', row: 2, title: { text: 'time' } },
    { type: 'log', template: 'yAxis', row: 3, title: { text: 'log' } }
  ],
  tooltip: true,
  legend: false,
  templates: {
    series: { marker: false, style: { strokeWidth: '3px' } },
    yAxis: { title: { rotation: 0 }, label: false, tick: { visible: false } }
  },
  series: [
    {
      template: 'series',
      type: 'area',
      lineType: 'spline',
      data: [
           7,  11, 9, 7.5,
        15.3,  13, 7,   9,
          11, 2.5
      ],
      xAxis: 0,
      yAxis: 0
    },
    {
      template: 'series',
      lineType: 'spline',
      data: [
           7,  10,  8, 6.5,
        15.3,  13, 10, 9.5,
        11.5, 3.5
      ],
      xAxis: 1,
      yAxis: 1
    },
    {
      template: 'series',
      lineType: 'step',
      data: [
           7,  10,  8, 6.5,
        15.3,  13, 10, 9.5,
        11.5, 3.5
      ],
      xStart: '2023-01',
      xStep: '1m',
      xAxis: 2,
      yAxis: 2
    },
    {
      template: 'series',
      lineType: 'spline',
      data: [
         1,  2,   4,   8,  16,
        32, 64, 128, 256, 512
      ],
      xAxis: 3,
      yAxis: 3
    }
  ]
}
export const tool = false