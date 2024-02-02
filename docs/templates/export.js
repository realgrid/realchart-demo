export const config = {
  type: 'bar',
  title: 'Title',
  subtitle: { visible: true, text: 'Subtitle' },
  export: { visible: true },
  options: { style: { backgroundImage: 'url(../assets/images/mountain.jpeg)' } },
  legend: { visible: true, location: 'bottom' },
  xAxis: {
    grid: { visible: true, lastVisible: true },
    crosshair: true,
    tick: true,
    title: 'Title',
    categories: [
      '1', '2',  '3',  '4',
      '5', '6',  '7',  '8',
      '9', '10', '11', '12'
    ],
    label: { step: 2 },
    line: true,
    scrollBar: { visible: true }
  },
  yAxis: [
    {
      crosshair: true,
      grid: true,
      line: true,
      tick: true,
      title: 'Title',
      break: { from: 50, to: 60 },
      guide: [
        { type: 'line', value: 12, label: 'line guide' },
        {
          type: 'range',
          start: 70,
          end: 90,
          label: {
            text: 'range guide',
            align: 'right',
            style: { fill: 'red' }
          }
        }
      ]
    }
  ],
  body: {
    zoomType: 'x',
    style: {},
    annotations: [
      {
        offsetX: 30,
        offsetY: 25,
        rotation: 5,
        text: 'Annotation Sample',
        style: { fill: 'white' },
        backgroundStyle: { fill: '#333', padding: '3px 5px', rx: 5, fillOpacity: 0.7 }
      },
      {
        offsetX: 260,
        offsetY: 25,
        rotation: -5,
        text: 'Text',
        style: { fill: 'white' },
        backgroundStyle: { padding: '3px 5px', fill: 'blue', rx: 5, fillOpacity: 0.7 }
      },
      {
        type: 'image',
        align: 'right',
        offsetX: 50,
        offsetY: 50,
        width: 100,
        imageUrl: '../assets/images/annotation.png'
      }
    ]
  },
  series: [
    {
      colorByPoint: true,
      pointLabel: true,
      pointWidth: 30,
      yAxis: 0,
      data: [
        [ 150 ], [ 140 ],
        [ 130 ], [ 120 ],
        [ 110 ], [ 90 ],
        [ 80 ],  [ 70 ],
        [ 60 ],  [ 50 ],
        [ 40 ],  [ 30 ]
      ]
    },
    {
      lineType: 'spline',
      type: 'line',
      color: '#333',
      trendline: {
        visible: true,
        type: 'movingAverage',
        movingAverage: { interval: 4 }
      },
      yAxis: 1,
      data: [
         10,  20,  30,  50,  70,
         90, 110, 130, 150, 160,
        170, 180
      ]
    }
  ],
  ChartTextEffect: { autoContrast: true },
  seriesNavigator: { visible: true }
}
export const tool = false