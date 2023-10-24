export const config = {
  templates: {
    gauge: {
      width: '33%',
      height: '50%',
      innerRadius: '93%',
      valueRim: {
        ranges: [
          { toValue: 25, color: 'green' },
          { toValue: 50, color: '#0000cc' },
          { toValue: 75, color: '#ffaa00' },
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
  title: 'Multiple Gauges',
  gauge: [
    {
      template: 'gauge',
      name: 'gauge1',
      left: 0,
      top: 0,
      value: 28.905546271565854
    },
    {
      template: 'gauge',
      name: 'gauge2',
      left: '33%',
      top: 0,
      valueRim: { thickness: '200%' },
      value: 86.75222473296837
    },
    {
      template: 'gauge',
      name: 'gauge3',
      left: '66%',
      top: 0,
      value: 92.73018215491572
    },
    {
      template: 'gauge',
      name: 'gauge4',
      left: 0,
      top: '50%',
      value: 57.73901495733189,
      innerRadius: '85%',
      valueRim: { stroked: true, style: { strokeLinecap: 'round' } },
      paneStyle: { stroke: 'lightblue', strokeWidth: '2px', borderRadius: '10px' }
    },
    {
      template: 'gauge',
      name: 'gauge5',
      left: '33%',
      top: '50%',
      value: 78.5961713453671,
      innerRadius: '75%',
      valueRim: { stroked: true, style: { strokeDasharray: '3' } },
      label: { style: { fontSize: '30px' } }
    },
    {
      template: 'gauge',
      name: 'gauge6',
      left: '66%',
      top: '50%',
      value: 56.52340400413247,
      innerStyle: { fill: '#003300', stroke: 'white', strokeWidth: '5px' },
      label: {
        text: '<t style="fill:yellow">${value}</t><t style="font-size:12px;">&nbsp;</t><t style="font-size:20px;">%</t><br><t style="font-size:20px;font-weight:normal">Gauge Test</t>',
        style: { fontWeight: 'bold', fill: 'white' }
      }
    }
  ]
}
