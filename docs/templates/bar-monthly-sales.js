export const config = {
  height: 550,
  actions: [
		{ 
			type: 'select',
			label: 'Palette',
			data: ['default', 'warm', 'cool', 'forest', 'gray', 'vintage', 'unicorn'], //.map(v => {return { value: v, label: v }}),
			action: ({value}) => {
				config.options.palette = value;
				// "options.palette"
				chart.load(config);
			}
		}
	],
  type: 'bar',
  title: { text: '월별 매출 현황 분석', style: { fontWeight: 'bold' } },
  subtitle: { visible: true, text: '1월부터 12월까지의 매출 변화 추적' },
  colorByPoint: false,
  options: {},
  legend: { visible: false },
  xAxis: {
    grid: { visible: true, endVisible: true },
    crosshair: true,
    tick: true,
    title: '월 (1월 - 12월)',
    categories: [
      'Jan', 'Fed', 'Mar',
      'Apr', 'May', 'Jun',
      'Jul', 'Ang', 'Sep',
      'Oct', 'Nov', 'Dec'
    ],
    label: { startStep: 0, step: 2 },
    line: true,
    scrollBar: { visible: true }
  },
  yAxis: [
    {
      crosshair: true,
      grid: true,
      line: true,
      tick: true,
      title: '월별 매출액 (단위: 백만 원)',
      break: { from: 90, to: 100 },
      guide: [
        {
          type: 'line',
          value: -72,
          label: {
            align: 'right',
            text: '안정성 임계선',
            style: { fill: 'red', stroke: 'red' }
          },
          style: { stroke: 'red' }
        },
        {
          type: 'range',
          startValue: 110,
          endValue: 120,
          label: {
            text: '업계 평균 매출 범위',
            align: 'left',
            style: { fill: 'black' }
          }
        }
      ]
    }
  ],
  body: { zoomType: 'x' },
  series: [
    {
      colorByPoint: true,
      pointLabel: true,
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
  ],
  ChartTextEffect: { autoContrast: true },
  seriesNavigator: { visible: true }
}
