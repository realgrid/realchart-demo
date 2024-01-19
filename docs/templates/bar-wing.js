export const config = {
  height: 600,
  templates: {
    xAxis: {
      categories: [
        '0-4',   '5-9',   '10-14',
        '15-19', '20-24', '25-29',
        '30-34', '35-40', '40-45',
        '45-49', '50-54', '55-59',
        '60-64', '65-69', '70-74',
        '75-79', '80+'
      ]
    }
  },
  title: 'Bar Wing Chart (No Split)',
  options: {},
  legend: { itemGap: 20, backgroundStyle: { fill: 'none' } },
  xAxis: [
    {
      template: 'xAxis',
      title: 'Daily fat',
      guide: [
        {
          type: 'range',
          startValue: 0,
          endValue: 5,
          style: { fill: 'red' }
        },
        {
          type: 'range',
          startValue: 5,
          endValue: 11,
          style: { fill: 'blue' }
        },
        {
          type: 'range',
          startValue: 11,
          endValue: 16,
          style: { fill: 'green' }
        }
      ]
    },
    { template: 'xAxis', title: 'Daily fat2', position: 'opposite' }
  ],
  yAxis: { title: 'Vertical 수직축 Axis', label: { numberFormat: 'a' } },
  series: {
    layout: 'overlap',
    children: [
      {
        name: 'Male',
        pointLabel: { visible: true, numberFormat: 'a##0.00' },
        color: '#468B97',
        data: [
          -8.98, -7.52, -6.65,
          -5.72, -4.85, -3.71,
          -2.76, -2.07,  -1.7,
          -1.47, -1.22, -0.99,
          -0.81, -0.62, -0.41,
          -0.23, -0.15
        ]
      },
      {
        name: 'Female',
        color: '#EF6262',
        pointLabel: { visible: true, numberFormat: '##0.00' },
        data: [
          8.84, 7.42, 6.57, 5.68,
          4.83, 3.74,  2.8, 2.14,
          1.79, 1.59, 1.34, 1.06,
          0.83, 0.63, 0.43, 0.25,
          0.19
        ]
      }
    ]
  }
}
