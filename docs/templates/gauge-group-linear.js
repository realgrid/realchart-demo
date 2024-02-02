export const config = {
  templates: { gauge: { label: { numberFormat: '#00.#' } } },
  options: { credits: {} },
  title: 'Linear Gauge Group',
  gauge: [
    {
      type: 'lineargroup',
      width: '80%',
      height: 250,
      maxValue: 100,
      children: [
        {
          name: 'gauge1',
          template: 'gauge',
          value: 42.401355935600215,
          valueRim: { style: { fill: '#00aaff' } },
          label: {
            style: { fill: '#00aaff' },
            text: "<t style='fill:gray'>게이지 101 -</t> ${value}"
          }
        },
        {
          name: 'gauge2',
          template: 'gauge',
          value: 98.51298407117139,
          valueRim: { style: { fill: '#ffaa00' } },
          label: {
            style: { fill: '#ffaa00' },
            text: "<t style='fill:gray'>게이지 202 -</t> ${value}"
          }
        },
        {
          name: 'gauge3',
          template: 'gauge',
          value: 97.65425218568531,
          valueRim: { style: { fill: '#88cc00' } },
          label: {
            style: { fill: '#88cc00' },
            text: "<t style='fill:gray'>게이지 303 -</t> ${value}"
          }
        },
        {
          name: 'gauge4',
          template: 'gauge',
          value: 77.83186151358,
          valueRim: { style: { fill: '#aa0000' } },
          label: {
            style: { fill: '#aa0000' },
            text: "<t style='fill:gray'>게이지 404 -</t> ${value}"
          }
        }
      ],
      scale: {},
      band: {
        gap: 3,
        ranges: [
          { toValue: 30, color: '#ff0' },
          { toValue: 60, color: '#fa0' },
          { color: '#f40' }
        ]
      },
      label: { text: 'Linear Gauges' },
      backgroundStyle: { stroke: 'lightblue', borderRadius: '10px' }
    }
  ]
}
export const tool = false