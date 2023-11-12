export const config = {
  title: '2022년도 서울시 월별 온도 변화',
  options: {},
  xAxis: {},
  yAxis: { title: '온도 차이 (°C)' },
  series: {
    pointLabel: { visible: true, effect: 'outline' },
    belowStyle: { fill: '#c00', stroke: '#c00' },
    data: [
      [ '1월', -2 ], [ '2월', -1 ],
      [ '3월', 1 ],  [ '4월', 5 ],
      [ '5월', 10 ], [ '6월', 14 ],
      [ '7월', 16 ], [ '8월', 15 ],
      [ '9월', 10 ], [ '10월', 7 ],
      [ '11월', 3 ], [ '12월', -1 ]
    ]
  }
}
