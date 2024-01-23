export const config = {
  templates: {
    series: {
      pointPadding: 0.05,
      pointLabel: {
        visible: true,
        effect: 'outline',
        outlineThickness: 3,
        numberFormat: ',#.00',
        style: { fontSize: '18px', fontWeight: 'bold' },
        styleCallback: p => p.yValue >= 2 ? { fill: 'red' } : void 0
      }
    }
  },
  options: { style: { paddingBottom: '45px' } },
  title: {
    text: '7개 카드사 연체율 추이',
    align: 'left',
    style: { fontSize: '32px', fontWeight: 'bold', fill: '#333' }
  },
  subtitle: {
    text: '(단위: %)',
    position: 'right',
    align: 'left',
    verticalAlign: 'bottom',
    style: { fontSize: '20px', fontFamily: 'Malgun' }
  },
  xAxis: {
    categories: [
      '신한', '삼성',
      'KB',   '롯데',
      'BC',   '우리',
      '하나'
    ],
    tick: 2,
    label: {
      style: { fontSize: '20px', fontWeight: 'bold', fill: '#555' },
      styleCallback: args => { return { fill: chart.getSeries('curr').getValueAt(args.value) >= 2 ? 'red' : undefined } }
    },
    crosshair: true
  },
  yAxis: {
    visible: false,
    guide: {
      type: 'line',
      value: 2,
      label: { text: '2.0', style: { fontSize: '18px' } },
      style: { stroke: 'red' }
    }
  },
  series: [
    {
      name: 'prev',
      template: 'series',
      label: '2023년 6월말',
      data: [
        1.73, 1.19,
        1.92, 1.36,
        1.54, 1.82,
        1.86
      ],
      color: '#6daeb7'
    },
    {
      name: 'curr',
      template: 'series',
      label: '2023년 9월말',
      data: [
        1.62, 1.15, 2.02,
        1.58, 1.05,  2.1,
        2.25
      ],
      color: '#117784'
    }
  ],
  legend: {
    location: 'body',
    markerSize: 14,
    style: { fontSize: '20px', fontWeight: 'bold', fill: '#555' }
  },
  annotations: [
    {
      imageUrl: '../assets/images/cards.png',
      front: true,
      width: 150,
      align: 'center',
      verticalAlign: 'top',
      offsetX: 100
    },
    {
      text: '*자료: 금융감독원<br>그래픽: 조아라 디자인기자',
      verticalAlign: 'bottom',
      scope: 'container',
      offsetX: 20,
      style: { fontSize: '18px', fontWeight: 'bold', fill: '#666' }
    }
  ]
}
export const tool = false