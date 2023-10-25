export const config = {
  title: 'Pareto Null Point',
  options: {},
  xAxis: { title: 'X Axis' },
  yAxis: [
    { title: 'Y Axis' },
    {
      minValue: 0,
      maxValue: 100,
      padding: 0,
      position: 'opposite',
      tick: {},
      label: { suffix: '%' }
    }
  ],
  series: [
    {
      name: 'main',
      pointLabel: true,
      data: [
        755, 172, 131, null,
        86,  72,  51,  36,
        10
      ]
    },
    {
      name: 'pareto',
      type: 'pareto',
      pointLabel: true,
      source: 'main',
      curved: false,
      yAxis: 1
    }
  ]
}
