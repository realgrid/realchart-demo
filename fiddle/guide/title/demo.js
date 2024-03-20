const config = {
  title: {
    text: 'RealChart Release 현황'
  },
  subtitle: {
    visible: 'true',
    text: 'Sub-Title'
  },
  series: {
    type: 'bar',
    data: [155, 138, 122, 133, 114, 113]
    // x축 label로 사용될 값을 지정할 수도 있다.
    // data: [['', 155], ['', 138], ['', 122], ['', 133], ['', 114], ['', 113]],
  }
};

let animate = false;
let chart;
function init() {
  chart = RealChart.createChart(document, 'realchart', config);
}