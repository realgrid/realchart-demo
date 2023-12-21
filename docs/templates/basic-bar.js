export const config = {
  actions: [
    {
      type: 'select',
      label: 'Palette',
      data: [
        'default', 'warm',
        'cool',    'forest',
        'gray',    'vintage',
        'unicorn'
      ],
      action: ({ value }) => { config.options.palette = value; chart.load(config); }
    },
    {
      type: 'check',
      label: 'Color By Point',
      value: false,
      action: ({ value }) => { config.series[0].colorByPoint = value; chart.load(config);}
    }
  ],
  type: 'bar',
  title: '월별 매출 현황 분석',
  subtitle: '1월부터 12월까지의 매출 변화 추적',
  options: { palette: 'default' },
  xAxis: {
    title: '월 (1월 - 12월)',
    categories: [
      'Jan', 'Fed', 'Mar',
      'Apr', 'May', 'Jun',
      'Jul', 'Ang', 'Sep',
      'Oct', 'Nov', 'Dec'
    ]
  },
  yAxis: [],
  series: [
    {
      name: '월 매출',
      pointWidth: 30,
      yAxis: 0,
      data: [
        [ -130 ], [ -100 ],
        [ -50 ],  [ 60 ],
        [ 70 ],   [ 115 ],
        [ 90 ],   [ 100 ],
        [ 120 ],  [ 130 ],
        [ 140 ],  [ 160 ]
      ]
    }
  ]
}
