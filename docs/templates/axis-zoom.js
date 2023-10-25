export const config = {
  options: {},
  title: {
    text: 'Axis Zooming',
    style: {
      padding: '1px 5px',
      marginBottom: '8px',
      fill: 'white',
      fontSize: '1.2em'
    },
    backgroundStyle: { fill: '#338', rx: '5px' }
  },
  body: { zoomType: 'x', style: {} },
  xAxis: {
    title: 'Period',
    crosshair: true,
    padding: 0,
    label: { autoArrange: 'step' },
    line: { style: { stroke: 'black', strokeWidth: 2 } },
    grid: { endVisible: true },
    scrollBar: { visible: true }
  },
  yAxis: { title: 'Hestavollane', line: true },
  series: {
    marker: {
      visible: true,
      shape: 'diamond',
      radius: 5,
      style: { stroke: 'white' }
    },
    data: [
      4.5, 5.1, 4.4, 3.7, 4.2, 3.7, 4.3,   4,   5, 4.9, 4.8,
      4.6, 3.9, 3.8, 2.7, 3.1, 2.6, 3.3, 3.8, 4.1,   1, 1.9,
      3.2, 3.8, 4.2, 3.8, 3.3, 4.7, 4.8, 4.6, 3.9, 3.8, 2.7,
      3.1, 2.6, 3.3, 3.8, 4.8, 4.6, 3.9, 3.8, 2.7, 3.1, 2.6,
      3.3, 3.8, 4.1,   1, 1.9, 3.2, 3.8, 4.2, 3.8, 3.3, 4.7,
      4.1, 3.9,   5, 4.1, 3.9, 3.5, 2.7, 3.1, 2.6, 3.3, 3.8,
      4.8, 4.6, 3.9, 3.8, 2.7, 3.1, 2.6, 3.3, 3.8
    ]
  }
}
