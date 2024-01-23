export const config = {
  title: {
    text: 'Number of Mobile Users in the World (Users In Millions)',
    alignBase: 'chart'
  },
  options: {},
  legend: { location: 'right' },
  series: {
    type: 'pie',
    totalAngle: 180,
    startAngle: 270,
    legendByPoint: true,
    radius: '70%',
    centerY: '80%',
    innerRadius: '50%',
    innerText: '<t style="fill:#002F5C;font-weight:bold;">Number of Mobile Users</t><br>in the world',
    pointLabel: { visible: true, text: '${y}' },
    pointColors: [
      '#002F5C',
      '#004987',
      '#004F92',
      '#00569D',
      '#3E77B6',
      '#90B1D8',
      '#BBD2Ec'
    ],
    tooltipText: '${x} - ${y}',
    data: [
      { name: 'Lava', y: 50 },
      { name: 'HP', y: 48 },
      { name: 'Moto', y: 55 },
      { name: 'Sony', y: 45 },
      { name: 'LG', y: 48 },
      { name: 'Samsung', y: 50 },
      { name: 'Redmi', y: 53 }
    ]
  }
}
export const tool = {
  actions: [
    {
      type: 'select',
      label: 'Legend.location',
      data: [ 'bottom', 'top', 'right', 'left' ],
      action: ({ value }) => { config.legend.location = value; chart.load(config); }
    },
    {
      type: 'slider',
      label: 'Total Angle',
      min: 0,
      max: 360,
      step: 1,
      value: 180,
      action: ({ value }) => { config.series.totalAngle = value; chart.load(config); }
    },
    {
      type: 'slider',
      label: 'Start Angle',
      min: 0,
      max: 360,
      value: 270,
      step: 1,
      action: ({ value }) => { config.series.startAngle = value; chart.load(config); }
    }
  ]
}