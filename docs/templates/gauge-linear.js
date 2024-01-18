export const config = {
  options: { credits: {} },
  title: 'Linear Gauges',
  gauge: [
    {
      type: 'linear',
      name: 'linear1',
      width: '60%',
      height: 85,
      top: 100,
      value: 81,
      valueBar: { style: { fill: 'blue' } },
      scale: { line: true },
      band: {
        visible: true,
        gap: 3,
        ranges: [
          { toValue: 30, color: '#ff0' },
          { toValue: 60, color: '#fa0' },
          { color: '#f40' }
        ]
      },
      label: { text: 'RealChart Linear<br>ver 1.0', style: { fill: 'red' } },
      style: {}
    },
    {
      type: 'linear',
      name: 'linear2',
      width: '50%',
      height: 100,
      top: 250,
      value: 81,
      valueBar: {
        styleCallback: (args) => { if (args.value < 40) return { fill: 'red' }; else if (args.value < 60) return { fill: 'yellow' }; }
      },
      scale: { line: true },
      ranges: [
        { toValue: 50, color: '#777' },
        { toValue: 70, color: '#aaa' }
      ],
      label: { position: 'top', text: 'RealChart Linear ver 1.0' },
      backgroundStyle: { stroke: 'lightblue' }
    }
  ]
}
