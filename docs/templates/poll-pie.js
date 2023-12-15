export const config = {
  templates: {
    series: {
      radius: '50%',
      innerRadius: '50%',
      pointLabel: {
        visible: true,
        numberFormat: '#.00',
        suffix: '%',
        position: 'inside',
        text: '${x}<br>${y}%'
      }
    },
    xAxis: { line: false, label: false }
  },
  annotations: [
    {
      text: '<t>긍정적으로 평가한다</t><br>\n' +
        '                <b style="font-size:20pt">32.5</b>',
      offsetX: 580,
      offsetY: 100,
      style: { fill: '#009D92', textAlign: 'center' }
    },
    {
      text: '<t>부정적으로 평가한다</t><br>\n' +
        '                <b style="font-size:30pt">60.4</b>',
      offsetX: 50,
      offsetY: 400,
      style: { fill: '#593219', textAlign: 'center' }
    },
    {
      imageUrl: '../assets/images/seoul.png',
      front: true,
      width: 260,
      offsetX: 260,
      offsetY: 180
    }
  ],
  options: {},
  title: {
    align: 'left',
    text: '2023년 11월',
    gap: 10,
    style: { fontSize: '16px', padding: '2px 5px' }
  },
  subtitle: {
    align: 'left',
    text: '여론 조사',
    style: {
      fill: 'black',
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '10px'
    }
  },
  legend: false,
  xAxis: { template: 'xAxis' },
  yAxis: { template: 'yAxis' },
  series: [
    {
      template: 'series',
      tooltipText: '${x}',
      type: 'pie',
      colorField: 'color',
      data: [
        { label: '매우 긍정', value: 11.1, color: '#009D92' },
        { label: '어느 정도 긍정', value: 21.4, color: '#47AFA8' },
        { label: '어느 정도 부정', value: 16.9, color: '#835337' },
        { label: '매우 부정', value: 43.6, color: '#593219' },
        { label: '모름|무응답', value: 7.1, color: '#937B6F' }
      ],
      pointLabel: {
        style: { fill: '#fff' },
        textCallback: ({x, y}) => { const fontSize = Math.max(15, y); return `${x}<br><b style="font-size:${fontSize}px">${y}</b>` }
      }
    }
  ]
}
