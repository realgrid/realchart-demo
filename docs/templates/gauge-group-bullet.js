export const config = {
  templates: { gauge: { label: { numberFormat: '#0.#' } } },
  options: { animatable: false, credits: {} },
  title: 'Bullet Gauge Group',
  gauge: [
    {
      type: 'bulletgroup',
      width: '80%',
      height: 250,
      maxValue: 100,
      children: [
        {
          name: 'gauge1',
          template: 'gauge',
          value: 9.111576422715718,
          targetValue: 90,
          valueRim: { style: { fill: '#00aaff' } },
          label: {
            style: { fill: '#00aaff' },
            text: "<t style='fill:gray'>게이지 101 -</t> ${value}"
          }
        },
        {
          name: 'gauge2',
          template: 'gauge',
          value: 39.27298725397572,
          targetValue: 70,
          valueRim: { style: { fill: '#ffaa00' } },
          label: {
            style: { fill: '#ffaa00' },
            text: "<t style='fill:gray'>게이지 202 -</t> ${value}"
          }
        },
        {
          name: 'gauge3',
          template: 'gauge',
          value: 78.33115734930496,
          targetValue: 75,
          valueRim: { style: { fill: '#88cc00' } },
          label: {
            style: { fill: '#88cc00' },
            text: "<t style='fill:gray'>게이지 303 -</t> ${value}"
          }
        },
        {
          name: 'gauge4',
          template: 'gauge',
          value: 98.91548534942274,
          targetValue: 88,
          valueRim: { style: { fill: '#aa0000' } },
          label: {
            style: { fill: '#aa0000' },
            text: "<t style='fill:gray'>게이지 404 -</t> ${value}"
          }
        }
      ],
      ranges: [
        { toValue: 50, color: '#777' },
        { toValue: 70, color: '#aaa' }
      ],
      scale: {},
      label: { text: 'Bullet Gauges' },
      paneStyle: { stroke: 'lightblue', borderRadius: '10px' }
    }
  ]
}
