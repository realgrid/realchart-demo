export const config = {
  options: {},
  title: 'BoxPlot',
  xAxis: { categories: [ '쓰리엠', '아디다스', '디즈니', 'Amazon', '이마트' ] },
  yAxis: {},
  series: {
    type: 'boxplot',
    pointLabel: true,
    data: [
      [ 560, 651, 748, 895, 965 ],
      [ 533, 753, 939, 980, 1080 ],
      [ 514, 662, 817, 870, 918 ],
      [ 624, 802, 816, 871, 950 ],
      [ 634, 736, 804, 882, 910 ]
    ]
  }
}
