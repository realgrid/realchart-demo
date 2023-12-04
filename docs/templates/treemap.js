export const config = {
  options: { animatable: false },
  title: 'Treemap',
  xAxis: {},
  yAxis: {},
  series: {
    type: 'treemap',
    tooltip: { text: 'id: ${id}<br>group: ${group}' },
    algorithm: 'squarify',
    pointLabel: { visible: true, text: '${x}', effect: 'outline', style: {} },
    data: [
      { name: 'A', value: 6 },
      { name: 'B', value: 5 },
      { name: 'C', value: 4 },
      { name: 'D', value: 3 },
      { name: 'E', value: 2 },
      { name: 'F', value: 2 },
      { name: 'G', value: 1 },
      { name: 'H', value: 1 },
      { name: 'I', value: 1 }
    ],
    style: {}
  }
}
