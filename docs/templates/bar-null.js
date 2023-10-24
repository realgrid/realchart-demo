export const config = {
  title: '월별 제품 판매량',
  options: {},
  xAxis: {
    title: '2023년 월별',
    categories: [
      '1월', '2월',
      '3월', '4월',
      '5월', '6월',
      '7월', '8월'
    ],
    grid: true
  },
  yAxis: { title: '판매 수량 (단위: 천 개)' },
  series: {
    name: '제품 A',
    pointLabel: true,
    data: [
      110, 220, null,
      0,   150, 90,
      130, 270
    ]
  }
}
