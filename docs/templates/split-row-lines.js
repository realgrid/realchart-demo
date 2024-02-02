export const config = {
  type: 'line',
  options: {},
  title: 'Row Split Lines',
  split: { visible: true, rows: 3 },
  xAxis: {
    categories: [
      '성남시', '용인시',
      '수원시', '일산시',
      '화성시', '평택시',
      '안양시', '부천시',
      '고양시', ' 안산시'
    ]
  },
  yAxis: [ {}, { row: 1, position: 'opposite' }, { row: 2 } ],
  series: [
    {
      lineType: 'spline',
      pointLabel: true,
      data: [
           7,  11, 9, 7.5,
        15.3,  13, 7,   9,
          11, 2.5
      ]
    },
    {
      yAxis: 1,
      lineType: 'spline',
      pointLabel: true,
      data: [
           7,  10,  8, 6.5,
        15.3,  13, 10, 9.5,
        11.5, 3.5
      ]
    },
    {
      yAxis: 2,
      lineType: 'spline',
      pointLabel: true,
      data: [
           7,  10,  8, 6.5,
        15.3,  13, 10, 9.5,
        11.5, 3.5
      ]
    }
  ]
}
export const tool = false