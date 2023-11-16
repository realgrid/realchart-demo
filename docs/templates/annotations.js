export const config = {
  options: {},
  title: 'Annotations',
  legend: true,
  xAxis: { tick: true, title: 'X Axis', grid: true },
  yAxis: { tick: true, title: 'Y Axis' },
  series: {
    pointLabel: { visible: true, position: 'head', effect: 'outline', style: {} },
    data: [
      [ 'home', 7 ],
      [ 'sky', 11 ],
      [ 'def', 9 ],
      [ '지리산', 14.3 ],
      [ 'zzz', 13 ],
      [ '낙동강', 12.5 ]
    ],
    style: {}
  },
  body: {
    annotations: [
      {
        offsetX: 30,
        offsetY: 40,
        rotation: -20,
        text: 'Annotation Sample',
        style: { padding: '3px 5px', fill: 'white' },
        backgroundStyle: { fill: '#33f', rx: 5, fillOpacity: 0.7 }
      },
      {
        type: 'image',
        align: 'right',
        offsetX: 50,
        offsetY: 0,
        width: 150,
        imageUrl: '/assets/images/daum.png'
      }
    ]
  }
}
