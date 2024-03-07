const config = {
  series: {
    type: 'boxplot',
    data: [[560, 651, 748, 895, 965], [533, 753, 939, 980, 1080], [514, 662, 817, 870, 918], [624, 802, 816, 871, 950], [634, 736, 804, 882, 910]]
  }
};
let animate = false;
let chart;
function init() {
  chart = RealChart.createChart(document, 'realchart', config);
}