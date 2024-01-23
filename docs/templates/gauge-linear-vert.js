export const config = {
  options: { credits: {} },
  title: 'Linear Gauges Vertical',
  gauge: [
    {
      type: 'linear',
      name: 'linear1',
      width: 65,
      height: '70%',
      top: 100,
      left: 200,
      vertical: true,
      maxValue: 100,
      value: 81,
      scale: { line: true },
      band: {
        gap: 3,
        ranges: [
          { toValue: 30, color: '#ff0' },
          { toValue: 60, color: '#fa0' },
          { color: '#f40' }
        ]
      },
      ranges: [
        { toValue: 50, color: '#777' },
        { toValue: 70, color: '#aaa' }
      ],
      label: { text: 'RealChart<br>Linear<br>ver 1.0' },
      style: { padding: '10px' },
      backgroundStyle: { stroke: 'lightblue', borderRadius: '10px' }
    },
    {
      type: 'linear',
      name: 'linear2',
      width: 200,
      height: '70%',
      top: 100,
      left: 350,
      vertical: true,
      maxValue: 100,
      value: 81,
      scale: { line: true },
      ranges: [
        { toValue: 50, color: '#777' },
        { toValue: 70, color: '#aaa' }
      ],
      label: { position: 'left', text: 'RealChart Linear<br> ver 1.0' }
    }
  ]
}
export const tool = false