export const config = {
  actions: [
    {
      type: 'select',
      label: 'Legend.location',
      data: [ 'bottom', 'top', 'right', 'left' ],
      action: ({value}) => { config.legend.location = value; chart.load(config); }
    },
    {
      type: 'slider',
      label: 'Total Angle',
      min: 0,
      max: 360,
      step: 1,
      value: 180,
      action: ({value}) => { config.series.totalAngle = value; chart.load(config); }
    },
    {
      type: 'slider',
      label: 'Start Angle',
      min: 0,
      max: 360,
      value: 270,
      step: 1,
      action: ({value}) => { config.series.startAngle = value; chart.load(config); }
    }
  ],
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
    pointLabel: { visible: true, text: '${y}', style: {} },
    data: [
      { name: 'Lava', y: 50, color: '#002F5C' },
      { name: 'HP', y: 48, color: '#004987' },
      { name: 'Moto', y: 55, color: '#004F92' },
      { name: 'Sony', y: 45, color: '#00569D' },
      { name: 'LG', y: 48, color: '#3E77B6' },
      { name: 'Samsung', y: 50, color: '#90B1D8' },
      { name: 'Redmi', y: 53, color: '#BBD2Ec' }
    ]
  }
}
