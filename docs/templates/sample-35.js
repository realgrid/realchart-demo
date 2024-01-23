export const config = {
  templates: {
    gauge: {
      width: '28%',
      band: {
        visible: true,
        ranges: [
          { toValue: 40, color: '#209C05' },
          { toValue: 65, color: '#EBFF0A' },
          { toValue: 85, color: '#FA9D00' },
          { color: '#FF0A0A' }
        ]
      },
      hand: {
        visible: true,
        length: '80%',
        radius: 8,
        style: { fill: '#777', strokeWidth: '30px' }
      },
      valueRim: {
        ranges: [
          { toValue: 40, color: '#209C05' },
          { toValue: 65, color: '#EBFF0A' },
          { toValue: 85, color: '#FA9D00' },
          { color: '#FF0A0A' }
        ]
      },
      pin: {
        visible: true,
        radius: 10,
        style: { stroke: '#AAA', fill: '#FFF' }
      },
      startAngle: 225,
      sweepAngle: 270,
      label: {
        numberFormat: '#0.0',
        style: { fontFamily: 'Arial', fontWeight: 'bold' },
        offsetY: 150
      }
    }
  },
  title: {
    text: 'System Performance Overview',
    style: { fontSize: '28px', fontWeight: 'bold' }
  },
  options: { theme: 'dark', style: { background: '#222' } },
  gauge: [
    {
      template: 'gauge',
      name: 'temperature',
      value: 66,
      scale: { visible: true },
      left: 0,
      label: {
        text: '\n' +
          '        <t style="fill:#262626 font-size:22px;"> ${value} </t><t style="font-size:18px;">°C</t>\n' +
          '      <t style="font-size:20px;font-weight:normal">CPU Temperature</t>\n' +
          '      '
      }
    },
    {
      template: 'gauge',
      name: 'usage',
      value: 55,
      scale: { visible: true },
      label: {
        text: '\n' +
          '      <t style="fill:#262626 font-size:22px;"> ${value} </t><t style="font-size:18px;">%</t>\n' +
          '      <t style="font-size:20px;font-weight:normal">CPU Usage Rate</t>\n' +
          '      '
      }
    },
    {
      template: 'gauge',
      name: 'ramUsage',
      value: 21,
      left: '72%',
      scale: { visible: true },
      label: {
        text: '\n' +
          '        <t style="fill:#262626 font-size:22px;"> ${value} </t><t style="font-size:18px;">%</t>\n' +
          '      <t style="font-size:20px;font-weight:normal">RAM Usage Rate</t>\n' +
          '      '
      }
    }
  ]
}
export const tool = {
  actions: [
    {
      type: 'button',
      label: '데이터 업데이트',
      action: () => { function updateDisplay() { let temperature, usage, ramUsage; const temperatureValue = chart .getGauge('temperature') .get('value'); const usageValue = chart.getGauge('usage').get('value'); const ramUsageValue = chart .getGauge('ramUsage') .get('value'); const randomValue = Math.random() < 0.5 ? -1 : 1; temperature = temperatureValue + randomValue * (Math.random() * 5); usage = usageValue + randomValue * (Math.random() * 5); ramUsage = ramUsageValue + randomValue * (Math.random() * 2); chart .getGauge('temperature') .set('value', Math.round(temperature)); chart.getGauge('usage').set('value', usage); chart.getGauge('ramUsage').set('value', ramUsage); } let intervalId = setInterval(updateDisplay, 1000); return intervalId; }
    }
  ]
}