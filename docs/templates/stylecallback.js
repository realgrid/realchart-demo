export const config = {
  title: 'Point Style Callback',
  options: {},
  xAxis: {
    title: '서울시',
    categories: [
      '2014', '2015',
      '2016', '2017',
      '2018', '2019',
      '2020', '2021',
      '2022', '2023'
    ],
    grid: true
  },
  yAxis: { title: 'Vertical 수직축 Axis' },
  series: [
    {
      name: 'column1',
      pointLabel: { visible: true, position: 'inside', effect: 'outline' },
      pointStyleCallback: args => { if (args.index == 0) { return { fill: 'lightgray' } } else if(args.yValue === args.yMax) { return { fill: 'green' } } },
      data: [
        155, 138, 122, 133,
        114, 113, 123, 119,
        125, 131
      ]
    },
    {
      name: 'line1',
      type: 'line',
      pointLabel: true,
      color: 'blue',
      data: [
        58, 80, 77, 79,  68,
        84, 96, 82, 77, 120
      ],
      style: { strokeDasharray: '5' },
      marker: { style: { stroke: 'white', strokeDasharray: 'none' } },
      pointStyleCallback: args => { if (args.yValue === args.yMax) { return { fill: 'red', strokeWidth: '5px', stroke: 'red' } } return { fill: 'green' } }
    }
  ]
}
export const tool = false