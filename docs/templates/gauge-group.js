export const config = {
  templates: { gauge: { label: { numberFormat: '#00.#' } } },
  options: { palette: 'unicorn' },
  title: 'Circle Gauge Group',
  gauge: [
    {
      colorByPoints: true,
      children: [
        {
          name: 'gauge1',
          template: 'gauge',
          value: 31.57086807966918,
          valueRim: { style: { fill: 'var(--color-1)' } },
          rim: { style: {} },
          label: {
            style: { fill: 'var(--color-1)' },
            text: "<t style='fill:gray'>Time -</t> ${value}"
          }
        },
        {
          name: 'gauge2',
          template: 'gauge',
          value: 81.5351666179555,
          valueRim: { style: { fill: 'var(--color-2)' } },
          label: {
            style: { fill: 'var(--color-2)' },
            text: "<t style='fill:gray'>Run -</t> ${value}"
          }
        },
        {
          name: 'gauge3',
          template: 'gauge',
          value: 61.145056638802586,
          valueRim: { style: { fill: 'var(--color-3)' } },
          label: {
            style: { fill: 'var(--color-3)' },
            text: "<t style='fill:gray'>Walk -</t> ${value}"
          }
        },
        {
          name: 'gauge4',
          template: 'gauge',
          value: 21.132021870988595,
          valueRim: { style: { fill: 'var(--color-4)' } },
          label: {
            style: { fill: 'var(--color-4)' },
            text: "<t style='fill:gray'>Kcal -</t> ${value}"
          }
        }
      ],
      innerRadius: '30%',
      sweepAngle: 270
    }
  ]
}
