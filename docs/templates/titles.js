export const config = {
  title: {
    text: 'Chart Title',
    style: { fill: 'white' },
    backgroundStyle: { fill: '#333', padding: '1px 4px', rx: '4' }
  },
  subtitle: {
    text: "<b>2023.01</b> <a href='https://www.worldbank.org/en/home'>World Bank.</a>",
    style: { fill: 'gray' }
  },
  xAxis: {
    title: 'X Axis',
    grid: true,
    categories: [
      'Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec'
    ]
  },
  yAxis: { title: 'Y Axis' },
  series: {
    pointLabel: { visible: true, position: 'head', effect: 'outline', style: {} },
    data: [
      [ -130 ], [ -100 ],
      [ -50 ],  [ 60 ],
      [ 70 ],   [ 115 ],
      [ 90 ],   [ 100 ],
      [ 120 ],  [ 130 ],
      [ 140 ],  [ 160 ]
    ],
    style: {}
  }
}
export const tool = false