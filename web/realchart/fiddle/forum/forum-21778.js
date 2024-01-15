/**
 * @demo
 *
 */
const prev = [8.49, 5.04, 9.59, 5.0, 7.08, 6.87, 11.65, 6.28];
const now = [11.89, 8.29, 12.09, 7.02, 9.09, 7.96, 12.72, 7.32];
const config = {
  options: {},
  title: {
    text: "기업별 전자제품 판매 현황",
  },
  subtitle: {
    text: "2023.01 ~ 12",
  },
  tooltip: {},
  xAxis: {
    title: "기업",
    categories: ["A기업", "B기업", "C기업", "D기업", "E기업"],
    grid: true,
  },
  yAxis: {
    title: "판매수 (단위 만)",
  },
  series: [
    {
      groupPadding: 0,
      children: [
        {
          name: "이전 지분율",
          data: prev,
          pointLabel: {
            visible: true,
          },
        },
        {
          name: "현재 지분율",
          data: now,
          pointLabel: {
            visible: true,
          },
        },
      ],
    },
    {
      type: "line",
      data: now.map((e,i) => {return e - prev[i]}),
	  pointLabel: {
		visible: true,
		effect: 'outline',
		autoContrast: true,
		suffix: ")",
		prefix: '(',
		style: {
			fontSize: "20px",
			rx: 20,
			backgroundColor: "red"
		},
		backgroundStyle: {
			fill: "red",
			backgroundColor: "red"
		}
	  },
	  style:{
		fillOpacity: 0,
		strokeWidth: 0,
		stroke: 0
	  }
    },
  ],
};

let animate = false;
let chart;
function init() {
  console.log("RealChart v" + RealChart.getVersion());
  // RealChart.setDebugging(true);
  RealChart.setLogging(true);

  chart = RealChart.createChart(document, "realchart", config);
}
