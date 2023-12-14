export const config = {
  options: { credits: {} },
  title: 'Linear Guages',
  gauge: [
    {
      type: 'linear',
      name: 'linear1',
      width: '60%',
      height: 65,
      top: 100,
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
      label: { text: 'RealChart Linear<br>ver 1.0' },
      style: { stroke: 'lightblue' }
    },
    {
      type: 'linear',
      name: 'linear2',
      width: '50%',
      height: 100,
      top: 250,
      value: 81,
      scale: { line: true },
      ranges: [
        { toValue: 50, color: '#777' },
        { toValue: 70, color: '#aaa' }
      ],
      label: { position: 'top', text: 'RealChart Linear ver 1.0' },
      style: { stroke: 'lightblue' }
    }
  ]
}
