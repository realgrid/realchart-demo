export const config = {
  templates: {
    gauge: {
      width: '250px',
      height: '250px',
      innerRadius: '93%',
      verticalAlign: 'middle',
      align: 'center',
      valueRim: {
        ranges: [
          { toValue: 25, color: '#FFD938' },
          { toValue: 51, color: '#FFD938' },
          { toValue: 75, color: '#66d0ff' },
          { color: '#66d0ff' }
        ]
      }
    }
  },
  title: { text: '계획 대비 실적 달성률 (반기)', style: { fontSize: '20px' } },
  options: { style: { backgroundColor: '#F4F7F8' } },
  subtitle: { text: '※ 비정기 금액 기준', align: 'right' },
  body: {
    annotations: [
      {
        text: '<t style="font-size:12pt;">계획금액 : </t>',
        anchor: 'gauge0',
        verticalAlign: 'bottom',
        align: 'left',
        offsetX: -80,
        offsetY: -5,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">실적금액 : </t>',
        anchor: 'gauge0',
        verticalAlign: 'bottom',
        align: 'left',
        offsetX: -80,
        offsetY: 20,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">662,110,000</t>',
        anchor: 'gauge0',
        verticalAlign: 'bottom',
        align: 'right',
        offsetX: -100,
        offsetY: -5,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">489,961,400</t>',
        anchor: 'gauge0',
        numberFormat: '#,##0',
        verticalAlign: 'bottom',
        align: 'right',
        offsetX: -100,
        offsetY: 20,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        type: 'shape',
        shape: 'rectangle',
        front: true,
        width: '200px',
        height: '30px',
        anchor: 'gauge0',
        offsetY: -10,
        align: 'center',
        style: { fill: '#0098ff', textAlign: 'center', stroke: 'none' }
      },
      {
        type: 'text',
        text: '<t style="font-size:12pt; font-weight: bold;">CyberGuardian</t>',
        front: true,
        anchor: 'gauge0',
        offsetY: -5,
        style: { fill: '#ffffff', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">계획금액 : </t>',
        anchor: 'gauge1',
        verticalAlign: 'bottom',
        align: 'left',
        offsetX: -80,
        offsetY: -5,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">실적금액 : </t>',
        anchor: 'gauge1',
        verticalAlign: 'bottom',
        align: 'left',
        offsetX: -80,
        offsetY: 20,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">651,675,000</t>',
        anchor: 'gauge1',
        verticalAlign: 'bottom',
        align: 'right',
        offsetX: -100,
        offsetY: -5,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">632,124,750</t>',
        anchor: 'gauge1',
        numberFormat: '#,##0',
        verticalAlign: 'bottom',
        align: 'right',
        offsetX: -100,
        offsetY: 20,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        type: 'shape',
        shape: 'rectangle',
        front: true,
        width: '200px',
        height: '30px',
        anchor: 'gauge1',
        offsetY: -10,
        align: 'center',
        style: { fill: '#0098ff', textAlign: 'center', stroke: 'none' }
      },
      {
        type: 'text',
        text: '<t style="font-size:12pt; font-weight: bold;">CloudCollab</t>',
        front: true,
        anchor: 'gauge1',
        offsetY: -5,
        style: { fill: '#ffffff', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">계획금액 : </t>',
        anchor: 'gauge2',
        verticalAlign: 'bottom',
        align: 'left',
        offsetX: -80,
        offsetY: -5,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">실적금액 : </t>',
        anchor: 'gauge2',
        verticalAlign: 'bottom',
        align: 'left',
        offsetX: -80,
        offsetY: 20,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">377,110,000</t>',
        anchor: 'gauge2',
        verticalAlign: 'bottom',
        align: 'right',
        offsetX: -100,
        offsetY: -5,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">494,014,100</t>',
        anchor: 'gauge2',
        numberFormat: '#,##0',
        verticalAlign: 'bottom',
        align: 'right',
        offsetX: -100,
        offsetY: 20,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        type: 'shape',
        shape: 'rectangle',
        front: true,
        width: '200px',
        height: '30px',
        anchor: 'gauge2',
        offsetY: -10,
        align: 'center',
        style: { fill: '#0098ff', textAlign: 'center', stroke: 'none' }
      },
      {
        type: 'text',
        text: '<t style="font-size:12pt; font-weight: bold;">DataWiseAI</t>',
        front: true,
        anchor: 'gauge2',
        offsetY: -5,
        style: { fill: '#ffffff', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">계획금액 : </t>',
        anchor: 'gauge3',
        verticalAlign: 'bottom',
        align: 'left',
        offsetX: -80,
        offsetY: -5,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">실적금액 : </t>',
        anchor: 'gauge3',
        verticalAlign: 'bottom',
        align: 'left',
        offsetX: -80,
        offsetY: 20,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">269,110,000</t>',
        anchor: 'gauge3',
        verticalAlign: 'bottom',
        align: 'right',
        offsetX: -100,
        offsetY: -5,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">565,131,000</t>',
        anchor: 'gauge3',
        numberFormat: '#,##0',
        verticalAlign: 'bottom',
        align: 'right',
        offsetX: -100,
        offsetY: 20,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        type: 'shape',
        shape: 'rectangle',
        front: true,
        width: '200px',
        height: '30px',
        anchor: 'gauge3',
        offsetY: -10,
        align: 'center',
        style: { fill: '#0098ff', textAlign: 'center', stroke: 'none' }
      },
      {
        type: 'text',
        text: '<t style="font-size:12pt; font-weight: bold;">AppShield</t>',
        front: true,
        anchor: 'gauge3',
        offsetY: -5,
        style: { fill: '#ffffff', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">계획금액 : </t>',
        anchor: 'gauge4',
        verticalAlign: 'bottom',
        align: 'left',
        offsetX: -80,
        offsetY: -5,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">실적금액 : </t>',
        anchor: 'gauge4',
        verticalAlign: 'bottom',
        align: 'left',
        offsetX: -80,
        offsetY: 20,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">443,272,000</t>',
        anchor: 'gauge4',
        verticalAlign: 'bottom',
        align: 'right',
        offsetX: -100,
        offsetY: -5,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">443,272,000</t>',
        anchor: 'gauge4',
        numberFormat: '#,##0',
        verticalAlign: 'bottom',
        align: 'right',
        offsetX: -100,
        offsetY: 20,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        type: 'shape',
        shape: 'rectangle',
        front: true,
        width: '200px',
        height: '30px',
        anchor: 'gauge4',
        offsetY: -10,
        align: 'center',
        style: { fill: '#0098ff', textAlign: 'center', stroke: 'none' }
      },
      {
        type: 'text',
        text: '<t style="font-size:12pt; font-weight: bold;">ProcessPilot</t>',
        front: true,
        anchor: 'gauge4',
        offsetY: -5,
        style: { fill: '#ffffff', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">계획금액 : </t>',
        anchor: 'gauge5',
        verticalAlign: 'bottom',
        align: 'left',
        offsetX: -80,
        offsetY: -5,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">실적금액 : </t>',
        anchor: 'gauge5',
        verticalAlign: 'bottom',
        align: 'left',
        offsetX: -80,
        offsetY: 20,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">441,231,000</t>',
        anchor: 'gauge5',
        verticalAlign: 'bottom',
        align: 'right',
        offsetX: -100,
        offsetY: -5,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        text: '<t style="font-size:12pt;">220,615,500</t>',
        anchor: 'gauge5',
        numberFormat: '#,##0',
        verticalAlign: 'bottom',
        align: 'right',
        offsetX: -100,
        offsetY: 20,
        front: true,
        style: { fill: '#000000', textAlign: 'center' }
      },
      {
        type: 'shape',
        shape: 'rectangle',
        front: true,
        width: '200px',
        height: '30px',
        anchor: 'gauge5',
        offsetY: -10,
        align: 'center',
        style: { fill: '#ff9f00', textAlign: 'center', stroke: 'none' }
      },
      {
        type: 'text',
        text: '<t style="font-size:12pt; font-weight: bold;">BP포탈</t>',
        front: true,
        anchor: 'gauge5',
        offsetY: -5,
        style: { fill: '#ffffff', textAlign: 'center' }
      }
    ]
  },
  gauge: [
    {
      template: 'gauge',
      maxValue: 100,
      name: 'gauge0',
      top: 40,
      left: '7%',
      value: 74,
      innerRadius: '75%',
      valueRim: { stroked: true, style: { strokeLinecap: 'round' } },
      backgroundStyle: {
        fill: 'white',
        filter: 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.1))',
        strokeWidth: '2px',
        borderRadius: '10px',
        height: '300px',
        width: '250px',
        verticalAlign: 'middle',
        align: 'center'
      },
      label: {
        text: '<t style="fill:#533cf5">${value}</t><t style="font-size:12px;"></t><t style="font-size:20px;">%</t><br><t style="font-size:18px;font-weight:bold;fill:#999">신규</t>',
        style: { fontWeight: 'bold' }
      }
    },
    {
      template: 'gauge',
      maxValue: 100,
      name: 'gauge1',
      top: 40,
      left: '37%',
      value: 97,
      innerRadius: '75%',
      valueRim: { stroked: true, style: { strokeLinecap: 'round' } },
      backgroundStyle: {
        fill: 'white',
        filter: 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.1))',
        strokeWidth: '2px',
        borderRadius: '10px',
        height: '300px',
        width: '250px',
        verticalAlign: 'middle',
        align: 'center'
      },
      label: {
        text: '<t style="fill:#533cf5">${value}</t><t style="font-size:12px;"></t><t style="font-size:20px;">%</t><br><t style="font-size:18px;font-weight:bold;fill:#999">기능</t>',
        style: { fontWeight: 'bold' }
      }
    },
    {
      template: 'gauge',
      maxValue: 131,
      name: 'gauge2',
      top: 40,
      left: '67%',
      value: 131,
      innerRadius: '75%',
      valueRim: { stroked: true, style: { strokeLinecap: 'round' } },
      backgroundStyle: {
        fill: 'white',
        filter: 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.1))',
        strokeWidth: '2px',
        borderRadius: '10px',
        height: '300px',
        width: '250px',
        verticalAlign: 'middle',
        align: 'center'
      },
      label: {
        text: '<t style="fill:#533cf5">${value}</t><t style="font-size:12px;"></t><t style="font-size:20px;">%</t><br><t style="font-size:18px;font-weight:bold;fill:#999">INF</t>',
        style: { fontWeight: 'bold' }
      }
    },
    {
      template: 'gauge',
      maxValue: 210,
      name: 'gauge3',
      top: '57%',
      left: '7%',
      value: 210,
      innerRadius: '75%',
      valueRim: { stroked: true, style: { strokeLinecap: 'round' } },
      backgroundStyle: {
        fill: 'white',
        filter: 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.1))',
        strokeWidth: '2px',
        borderRadius: '10px',
        height: '300px',
        width: '250px',
        verticalAlign: 'middle',
        align: 'center'
      },
      label: {
        text: '<t style="fill:#533cf5">${value}</t><t style="font-size:12px;"></t><t style="font-size:20px;">%</t><br><t style="font-size:18px;font-weight:bold;fill:#999">Tax</t>',
        style: { fontWeight: 'bold' }
      }
    },
    {
      template: 'gauge',
      maxValue: 100,
      name: 'gauge4',
      top: '57%',
      left: '37%',
      value: 100,
      innerRadius: '75%',
      valueRim: { stroked: true, style: { strokeLinecap: 'round' } },
      backgroundStyle: {
        fill: 'white',
        filter: 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.1))',
        strokeWidth: '2px',
        borderRadius: '10px',
        height: '300px',
        width: '250px',
        verticalAlign: 'middle',
        align: 'center'
      },
      label: {
        text: '<t style="fill:#533cf5">${value}</t><t style="font-size:12px;"></t><t style="font-size:20px;">%</t><br><t style="font-size:18px;font-weight:bold;fill:#999">Firm</t>',
        style: { fontWeight: 'bold' }
      }
    },
    {
      template: 'gauge',
      maxValue: 100,
      name: 'gauge5',
      top: '57%',
      left: '67%',
      value: 50,
      innerRadius: '75%',
      valueRim: { stroked: true, style: { strokeLinecap: 'round' } },
      backgroundStyle: {
        fill: 'white',
        filter: 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.1))',
        strokeWidth: '2px',
        borderRadius: '10px',
        height: '300px',
        width: '250px',
        verticalAlign: 'middle',
        align: 'center'
      },
      label: {
        text: '<t style="fill:#533cf5">${value}</t><t style="font-size:12px;"></t><t style="font-size:20px;">%</t><br><t style="font-size:18px;font-weight:bold;fill:#999">Pro</t>',
        style: { fontWeight: 'bold' }
      }
    }
  ]
}
export const tool = { width: 1000, height: 800 }