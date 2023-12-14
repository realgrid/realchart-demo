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
      value: 37.21416759545355
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
      value: 88.73232945189729
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
      value: 48.00549477941751
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
      value: 86.49838290523874
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
      value: 85.86656434247575
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
      value: 8.093071823888366
    }
  ]
}
