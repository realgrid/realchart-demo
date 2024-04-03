/**
 * @title Party Poll
 */

const config = {
  title: '정당별 비례대표 지지율',
  assets: [{
    type: 'colors',
    id: '비례대표정당색',
    colors: ['#0050C5', '#E61E29', '#017B32', '#FE7722', '#132450', '#0173CC', '#BFBDBE']
  }],
  series: {
    data: [['더불어민주연합', 19.7], ['국민의미래', 31.1], ['녹색정의당', 2.2], ['개혁신당', 5.6], ['새로운미래', 3.6], ['조국혁신당', 28.8], ['그외다른정당', 3.9]],
    pointColors: '비례대표정당색'
  }
};
let animate = false;
let chart;
function init() {
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}