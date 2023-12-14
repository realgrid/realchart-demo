const config = {
  title: "Linear Gradient",
  options: {},
  assets: [
    {
      type: "linearGradient",
      id: "gradient-1",
      color: ["red", "purple"],
      opacity: 1,
      dir: "right",
    },
  ],
  xAxis: {
    type: "category",
  },
  yAxis: {},
  series: {
    type: "area",
    lineType: "spline",
    marker: {},
    data: [
      ["home", 7],
      ["sky", 11],
      ["def", 9],
      ["지리산", 15.3],
      ["zzz", 13],
      ["낙동강", 12.5],
      ["Youdube", 10.5],
    ],
    style: {
      fill: "url(#gradient-1)",
      fillOpacity: 1,
      strokeWidth: "2px",
    },
  },
};

let animate = false;
let chart;

function init() {
  chart = RealChart.createChart(document, "realchart", config);
}