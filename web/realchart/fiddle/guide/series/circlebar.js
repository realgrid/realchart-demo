const config = {
    title: '연도별 서울시 평균 대기질 지수',
    xAxis: {
      title: '서울시',
      categories: ['2021', '2022', '2023'],
      minPadding: 0.25,
      maxPadding: 0.1,
    },
    yAxis: {
      title: '대기질 지수(Air Quality Index, AQI)'
    },
    series: [
      {
        type: 'circlebar',
        name: '대기질',
        pointLabel: {
          visible: true,
          style: {
            fontSize: '20px',
          },
        },
        data: [155, 138, 122],
      },
    ],
    ChartTextEffect: {
      autoContrast: false,
    },
  };
let chart;

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    RealChart.setLogging(false);

    chart = RealChart.createChart(document, 'realchart', config);
}
