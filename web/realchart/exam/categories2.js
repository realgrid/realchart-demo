/**
 * @demo
 * 
 * Bar Series 기본 예제.
 */
const categories = [
    "주식회사 이노엔스",
    "로키에스앤에스코리아(주)",
    "(주)퓨어테크피앤티",
    "(주)청아필터",
    "(주)아이티에스솔루션",
    "(주) 퓨리텍",
    "주식회사 유한포장",
    "주식회사 드림팩토리",
    "크레텍웰딩 주식회사",
    "주식회사 포메이션세븐",
    "주식회사 이투비플러스",
    "피티케이(주)",
    "현대",
    "크레텍책임 주식회사",
    "제이앤에스",
    "(주)대한올포랩",
    "",
    "",
    "디앤에스(D&S)",
    "플랜비",
    "삼운시스템",
  ];
  
  const config = {
    title: "매입금액",
    templates: {
      pointLabel: {
        pointLabel: {
          visible: true,
          position: "inside",
          effect: "outline",
        },
      },
    },
    xAxis: {
      categories,
      grid: {
        visible: !true,
      },
    },
    yAxis: {
      title: {
        text: "단위: 백만원",
        align: "end",
      },
    },
    series: [
      {
        name: "매입금액",
        data: [
          ["주식회사 이노엔스", 303],
          ["로키에스앤에스코리아(주)", 154],
          ["(주)퓨어테크피앤티", 48],
          ["(주)청아필터", 35],
          ["(주)아이티에스솔루션", 32],
          ["(주) 퓨리텍", 21],
          ["주식회사 유한포장", 21],
          ["주식회사 드림팩토리", 18],
          ["크레텍웰딩 주식회사", 16],
          ["주식회사 포메이션세븐", 15],
          ["주식회사 이투비플러스", 15],
          ["피티케이(주)", 13],
          ["현대", 9],
          ["크레텍책임 주식회사", 7],
          ["제이앤에스", 6],
          ["(주)대한올포랩", 5],
          ["", 5],
          ["", 15],
          ["디앤에스(D&S)", 5],
          ["플랜비", 5],
          ["삼운시스템", 4],
        ],
      },
    ],
    legend: {
      visible: true,
    },
  };
  
let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createCheckBox(container, 'Always Animate', function (e) {
        animate = _getChecked(e);
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis[0].reversed = _getChecked(e);
        config.xAxis[1].reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
