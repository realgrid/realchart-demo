const config = {
    title: "Multi Axes 01",
    xAxis: {
        categories: [
            '일반모', '미세모', '이중모', '특일반모', '특미세모', '특이중모'
        ]
    },
    yAxis: [{
        // position: 'opposite'
    }, {
        position: 'opposite'
    }],
    series: [{
        name: '제품 중량',
        data: [7, 11, 9, 14.3, 13, 12.5],
        pointPadding: 0.2,
        style: {
            fill: '#0088ff40'
        }
    }, {
        name: '제품 길이',
        data: [97, 121, 89, 114.3, 103, 92.5],
        yAxis: 1,
        style: {
            fill: '#00ff8840'
        }
    }]
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
