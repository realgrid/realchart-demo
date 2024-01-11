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
          value: 10.349805235754994,
          valueRim: { style: { fill: '#00aaff' } },
          label: {
            style: { fill: '#00aaff' },
            text: "<t style='fill:gray'>게이지 101 -</t> ${value}"
          }
        },
        {
          name: 'gauge2',
          template: 'gauge',
          value: 8.67060881068371,
          valueRim: { style: { fill: '#ffaa00' } },
          label: {
            style: { fill: '#ffaa00' },
            text: "<t style='fill:gray'>게이지 202 -</t> ${value}"
          }
        },
        {
          name: 'gauge3',
          template: 'gauge',
          value: 79.15519210212398,
          valueRim: { style: { fill: '#88cc00' } },
          label: {
            style: { fill: '#88cc00' },
            text: "<t style='fill:gray'>게이지 303 -</t> ${value}"
          }
        },
        {
          name: 'gauge4',
          template: 'gauge',
          value: 36.635404887866365,
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
      paneStyle: { stroke: 'lightblue', borderRadius: '10px' }
    }
  ]
}
