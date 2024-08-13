const config = {
  type: 'histogram',
  title: 'Distribution of Daily Mobile Phone Usage Times',
  xAxis: {
    title: 'Daily Mobile Phone Usage Time (minutes)'
  },
  yAxis: {
    title: 'Number of Users'
  },
  series: {
    data: [45, 60, 72, 85, 90, 95, 105, 110, 120, 125, 130, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 55, 62, 73, 88, 91, 103, 116, 121, 127, 138, 142, 148, 156, 167, 174, 180, 189, 194, 200, 208, 214, 222, 235, 240, 250, 259, 267, 275, 283, 290, 295, 305, 315, 322, 328, 333, 340, 348, 355, 360, 368, 373, 380, 385, 395, 400, 405, 410, 420, 430, 440, 450, 460, 470, 480, 490]
  }
};
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}