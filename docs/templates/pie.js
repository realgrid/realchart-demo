export const config = {
  title: {
    text: '2017년 3/4분기',
    gap: 10,
    backgroundStyle: { fill: 'black', padding: '2px 5px', rx: '3px' },
    style: { fill: '#fff', fontSize: '16px' }
  },
  subtitle: {
    text: '모바일 트래픽 분석',
    style: {
      fill: 'black',
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '10px'
    }
  },
  series: [
    {
      type: 'pie',
      radius: '40%',
      legendByPoint: true,
      pointLabel: {
        text: '${x}<br>${y}%',
        visible: true,
        numberFormat: '#.00',
        style: {
          fill: '#fff',
          stroke: '#d3d3d3',
          strokeWidth: '0.2px',
          fontSize: '14px'
        }
      },
      data: [
        { x: 'Android', y: 53.51, sliced: true },
        { x: 'iOS', y: 29.14 },
        { x: 'Windows', y: 10.72 },
        { x: '기타', y: 6.63 }
      ]
    }
  ]
}
export const tool = false