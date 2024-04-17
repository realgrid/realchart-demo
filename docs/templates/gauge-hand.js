export const config = {
  templates: {
    gauge: {
      innerRadius: '93%',
      valueRim: {
        ranges: [
          { endValue: 25, color: 'green' },
          { endValue: 50, color: '#0000cc' },
          { endValue: 75, color: '#ffaa00' },
          { color: 'red' }
        ]
      },
      label: {
        text: '<t style="fill:blue">${value}</t><t style="font-size:12px;">&nbsp;</t><t style="font-size:20px;">%</t><br><t style="font-size:20px;font-weight:normal">Gauge Test</t>',
        style: { fontWeight: 'bold' }
      }
    }
  },
  options: { credits: {} },
  title: 'Hand Gauges',
  gauge: [
    {
      template: 'gauge',
      name: 'gauge1',
      width: '33%',
      height: '50%',
      left: 0,
      top: 0,
      hand: true,
      pin: true,
      label: {
        text: '<t style="fill:blue">${value}</t><t style="font-size:12px;">&nbsp;</t><t style="font-size:20px;">%</t>',
        offsetY: 30,
        style: { fontWeight: 'bold', fontSize: '30px' }
      },
      value: 16.36571665531992
    },
    {
      template: 'gauge',
      name: 'gauge2',
      width: '33%',
      height: '50%',
      left: '33%',
      top: 0,
      valueRadius: '100%',
      valueRim: { thickness: '200%' },
      hand: { visible: true, length: '80%', style: { fill: 'blue' } },
      pin: { visible: true, style: { stroke: 'blue' } },
      label: false,
      value: 36.68888491740607
    },
    {
      template: 'gauge',
      name: 'gauge3',
      width: '33%',
      height: '50%',
      left: '66%',
      top: 0,
      startAngle: 240,
      sweepAngle: 245,
      hand: true,
      pin: true,
      label: {
        text: '<t style="fill:blue">${value}</t><t style="font-size:12px;">&nbsp;</t><t style="font-size:20px;">%</t>',
        offsetY: 40,
        style: { fontWeight: 'bold', fontSize: '30px' }
      },
      value: 56.72812337005482
    },
    {
      template: 'gauge',
      name: 'gauge4',
      width: '33%',
      height: '50%',
      left: 0,
      top: '50%',
      innerRadius: '80%',
      rim: {},
      band: {
        visible: true,
        position: 'inside',
        thickness: '100%',
        ranges: [
          { toValue: 20, color: '#a40' },
          { toValue: 40, color: '#cc0' },
          { toValue: 60, color: '#080' },
          { toValue: 80, color: '#500' },
          { color: '#300' }
        ]
      },
      valueRim: false,
      hand: { visible: true, offset: '15%', length: '95%' },
      pin: true,
      label: false,
      value: 85.8916770296935
    },
    {
      template: 'gauge',
      name: 'gauge5',
      width: '33%',
      height: '50%',
      left: '33%',
      top: '50%',
      hand: {
        visible: true,
        offset: '-15%',
        length: '80%',
        style: { fill: 'green' }
      },
      pin: { visible: true, style: { stroke: '#080', fill: '#0f0' } },
      label: false,
      value: 66.12635718485895
    },
    {
      template: 'gauge',
      name: 'gauge6',
      width: '33%',
      height: '50%',
      left: '66%',
      top: '50%',
      clockwise: false,
      hand: true,
      pin: true,
      label: false,
      value: 2.689128569005894
    }
  ]
}
export const tool = false