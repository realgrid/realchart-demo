export const config = {
  options: { credits: {} },
  title: '경기도 성남시 인구 현황',
  legend: true,
  body: { style: { stroke: 'none' } },
  xAxis: { title: { text: '수정구1303' }, crosshair: true },
  yAxis: { title: { text: '전체 인구수' } },
  series: {
    pointLabel: {
      visible: true,
      effect: 'outline',
      style: {},
      styleCallback: undefined
    },
    data: [
      [ '신흥1동', 12904 ],
      [ '신흥2동', 19796 ],
      [ '신흥3동', 10995 ],
      [ '태평1동', 14625 ],
      [ '태평2동', 14627 ],
      [ '태평3동', 12649 ],
      [ '태평4동', 12279 ]
    ],
    data2: [
      [ 1, 7 ],
      [ 2, 11 ],
      [ 3, 9 ],
      [ 4, 10 ],
      [ 5, 14.3 ],
      [ 6, 13 ],
      [ 7, 12.5 ]
    ],
    style: {}
  }
}
