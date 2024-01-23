export const config = {
  type: 'boxplot',
  options: {},
  title: 'Multiple BoxPlot',
  xAxis: { categories: [ '쓰리엠', '아디다스', '디즈니', 'Amazon', '이마트' ] },
  yAxis: {},
  series: [
    {
      pointLabel: true,
      data: [
        [ 490, 581, 748, 895, 965 ],
        [ 533, 753, 939, 980, 1080 ],
        [ 514, 662, 817, 870, 918 ],
        [ 624, 802, 816, 871, 950 ],
        [ 634, 736, 804, 882, 910 ]
      ]
    },
    {
      color: '#00ff0080',
      pointLabel: true,
      data: [
        [ 560, 651, 728, 895, 965 ],
        [ 633, 793, 939, 980, 1080 ],
        [ 554, 662, 817, 870, 918 ],
        [ 724, 802, 816, 871, 950 ],
        [ 700, 736, 804, 882, 910 ]
      ]
    }
  ]
}
export const tool = false