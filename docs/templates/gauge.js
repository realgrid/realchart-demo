export const config = {
  options: { credits: {} },
  title: 'Circle Gauge',
  gauge: {
    name: 'gauge1',
    value: 18.682803470311793,
    rim: {},
    valueRim: {
      ranges: [
        { toValue: 30, color: '#0098ff' },
        { toValue: 70, color: '#66d0ff' },
        { color: '#ff5c35' }
      ]
    },
    scale: { visible: true },
    band: {
      visible: true,
      ranges: [
        { toValue: 20, color: '#0098ff' },
        { toValue: 40, color: '#66d0ff' },
        { toValue: 60, color: '#ff5c35' },
        { toValue: 80, color: '#ff9f00' },
        { color: '#ffd938' }
      ]
    },
    label: {
      numberFormat: '#0.0',
      text: '<t style="fill:#262626">${value}</t><t style="font-size:24px;">%</t><br><t style="font-size:20px;font-weight:normal">Gauge Test</t>',
      text2: '<t style="font-size:20px;font-weight:normal">Gauge Test</t><br><t style="fill:blue">${value}</t><t style="font-size:24px;">%</t>',
      style: { fontFamily: 'Arial', fontWeight: 'bold' }
    }
  }
}
export const tool = false