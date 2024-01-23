export const config = {
  type: 'line',
  templates: {
    xAxis: {
      line: { visible: true, style: { strokeWidth: 3 } },
      tick: false,
      label: true,
      padding: -0.25,
      style: { fill: '#fff' }
    },
    yAxis: { grid: false, label: false, strictMin: 10, maxValue: 80 },
    paneBody: { body: { style: { fill: '#F7F5F5' } } },
    annoSubtitle: {
      offsetY: -30,
      align: 'center',
      style: { fill: '#000', fontSize: '12pt', fontWeight: 'bold' }
    },
    annoLegend: {
      align: 'center',
      style: { fontSize: '14pt', fontWeight: 'bold' }
    },
    series: {
      marker: false,
      pointLabel: { visible: true },
      style: { strokeWidth: 4 }
    }
  },
  title: { text: 'Share Who Think Each Candidate ...', align: 'left' },
  subtitle: { text: '<t></t>', titleGap: 30 },
  split: {
    visible: true,
    cols: 3,
    panes: [
      {
        template: 'paneBody',
        body: {
          annotations: [
            { template: 'annoSubtitle', text: 'is too old' },
            {
              template: 'annoLegend',
              offsetY: 85,
              text: 'Biden',
              style: { fill: 'var(--color-1)' }
            },
            {
              template: 'annoLegend',
              offsetY: 281.57142857142856,
              text: 'Trump',
              style: { fill: '#aaa' }
            }
          ]
        },
        col: 0
      },
      {
        template: 'paneBody',
        body: {
          annotations: [
            {
              template: 'annoSubtitle',
              text: 'does not have the mental sharpness'
            },
            {
              template: 'annoLegend',
              offsetY: 80.14285714285714,
              text: 'Biden',
              style: { fill: 'var(--color-1)' }
            },
            {
              template: 'annoLegend',
              offsetY: 196.57142857142856,
              text: 'Trump',
              style: { fill: '#aaa' }
            }
          ]
        },
        col: 1
      },
      {
        template: 'paneBody',
        body: {
          annotations: [
            {
              template: 'annoSubtitle',
              text: 'does not have the temperament'
            },
            {
              template: 'annoLegend',
              offsetY: 201.42857142857144,
              text: 'Biden',
              style: { fill: 'var(--color-1)' }
            },
            {
              template: 'annoLegend',
              offsetY: 65.57142857142857,
              text: 'Trump',
              style: { fill: '#aaa' }
            }
          ]
        },
        col: 2
      }
    ]
  },
  options: { style: {}, credits: false },
  legend: false,
  xAxis: [
    { type: 'category', template: 'xAxis', col: 0 },
    { type: 'category', template: 'xAxis', col: 1 },
    { type: 'category', template: 'xAxis', col: 2 }
  ],
  yAxis: { template: 'yAxis' },
  body: { style: { backgroundColor: '#EFEEE5' } },
  series: [
    {
      xAxis: 0,
      children: [
        {
          template: 'series',
          name: 'Biden',
          data: [ [ '2020', 34 ], [ '2023', 71 ] ],
          pointLabel: { position: 'head' },
          style: { stroke: 'var(--color-1)' }
        },
        {
          template: 'series',
          name: 'Trump',
          data: [ [ '2020', 18 ], [ '2023', 39 ] ],
          pointLabel: { position: 'foot' },
          style: { stroke: '#bbb' }
        }
      ]
    },
    {
      xAxis: 1,
      children: [
        {
          template: 'series',
          name: 'Biden',
          data: [ [ '2020', 45 ], [ '2023', 62 ] ],
          pointLabel: { position: 'foot' },
          style: { stroke: 'var(--color-1)' }
        },
        {
          template: 'series',
          name: 'Trump',
          data: [ [ '2020', 48 ], [ '2023', 44 ] ],
          pointLabel: { position: 'head' },
          style: { stroke: '#bbb' }
        }
      ]
    },
    {
      xAxis: 2,
      children: [
        {
          template: 'series',
          name: 'Biden',
          data: [ [ '2020', 39 ], [ '2023', 51 ] ],
          pointLabel: { position: 'foot' },
          style: { stroke: 'var(--color-1)' }
        },
        {
          template: 'series',
          name: 'Trump',
          data: [ [ '2020', 58 ], [ '2023', 55 ] ],
          pointLabel: { position: 'head' },
          style: { stroke: '#bbb' }
        }
      ]
    }
  ]
}
export const tool = false