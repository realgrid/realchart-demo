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
          value: 47.293682673243076,
          valueRim: { style: { fill: '#00aaff' } },
          label: {
            style: { fill: '#00aaff' },
            text: "<t style='fill:gray'>게이지 101 -</t> ${value}"
          }
        },
        {
          name: 'gauge2',
          template: 'gauge',
          value: 76.31070203756174,
          valueRim: { style: { fill: '#ffaa00' } },
          label: {
            style: { fill: '#ffaa00' },
            text: "<t style='fill:gray'>게이지 202 -</t> ${value}"
          }
        },
        {
          name: 'gauge3',
          template: 'gauge',
          value: 46.77966598123968,
          valueRim: { style: { fill: '#88cc00' } },
          label: {
            style: { fill: '#88cc00' },
            text: "<t style='fill:gray'>게이지 303 -</t> ${value}"
          }
        },
        {
          name: 'gauge4',
          template: 'gauge',
          value: 24.102086255276987,
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