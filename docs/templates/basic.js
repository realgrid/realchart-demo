export const config = {
  options: {},
  title: '경기도 성남시 인구 현황',
  legend: true,
  body: { style: { stroke: 'none' } },
  xAxis: {
    label: { startStep: 0, step: 2 },
    grid: { visible: true, endVisible: true },
    tick: true,
    title: { text: '수정구' },
    crosshair: true
  },
  yAxis: { title: { text: '전체 인구수' } },
  series: {
    pointLabel: { visible: true },
    onPointClick: args => { chart.series.updateData([["신흥1동", 100], ["신흥2동", 200]], true);},
    data: [
      [ '신흥1동', 12904 ],
      [ '신흥2동', 19796 ],
      [ '신흥3동', 10995 ],
      [ '태평1동', 14625 ],
      [ '태평2동', 14627 ],
      [ '태평3동', 12649 ],
      [ '태평4동', 12279 ]
    ]
  }
}
