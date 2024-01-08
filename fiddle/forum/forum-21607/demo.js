const config = {
  title: "Point Style Callback",
  options: {
    // animatable: false
  },
  xAxis: {
    categories: ['쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도']
  },
  yAxis: {
    title: "Vertical 수직축 Axis"
  },
  series: [{
    name: 'column1',
    pointLabel: {
      visible: true,
      position: 'inside',
      effect: 'outline'
    },
    pointStyleCallback: args => {
      if (args.index == 0) {
        return {
          fill: 'lightgray'
        };
      } else if (args.yValue === args.yMax) {
        return {
          fill: 'green'
        };
      }
    },
    data: [11, 22, 15, 9, 19, 13, 27, 15]
  }]
};
let animate = false;
let chart;
function init() {
  chart = RealChart.createChart(document, "realchart", config);
  setTimeout(() => {
    chart.series.setValueAt(0, 20);
  }, 2000);
}