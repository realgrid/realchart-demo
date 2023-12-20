export const config = {
  templates: { gauge: { label: { numberFormat: '#00.#' } } },
  options: { credits: {} },
  title: 'Circle Gauge Group',
  gauge: [
    {
      children: [
        {
          name: 'gauge1',
          template: 'gauge',
          value: 79.26174122251722,
          valueRim: { style: { fill: '#00aaff' } },
          label: {
            style: { fill: '#00aaff' },
            text: "<t style='fill:gray'>Time -</t> ${value}"
          }
        },
        {
          name: 'gauge2',
          template: 'gauge',
          value: 84.76781407946505,
          valueRim: { style: { fill: '#ffaa00' } },
          label: {
            style: { fill: '#ffaa00' },
            text: "<t style='fill:gray'>Run -</t> ${value}"
          }
        },
        {
          name: 'gauge3',
          template: 'gauge',
          value: 91.64270132085544,
          valueRim: { style: { fill: '#88cc00' } },
          label: {
            style: { fill: '#88cc00' },
            text: "<t style='fill:gray'>Walk -</t> ${value}"
          }
        },
        {
          name: 'gauge4',
          template: 'gauge',
          value: 10.967674084580704,
          valueRim: { style: { fill: 'var(--color-3)' } },
          label: {
            style: { fill: 'var(--color-3)' },
            text: "<t style='fill:gray'>Kcal -</t> ${value}"
          }
        }
      ],
      innerRadius: '30%',
      sweepAngle: 270,
      valueRim: {
        ranges: [
          { toValue: 25, color: 'green' },
          { toValue: 50, color: '#0000cc' },
          { toValue: 75, color: '#ffaa00' },
          { color: 'red' }
        ]
      },
      panelStyle: { stroke: 'lightblue', borderRadius: '10px' }
    }
  ]
}
