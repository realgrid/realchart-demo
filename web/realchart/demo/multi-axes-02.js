const config = {
    title: "Multi Axes 02",
    xAxis: [{
        categories: [
            '일반모', '미세모', '이중모', '특일반모', '특미세모', '특이중모'
        ]
    }, {
        position: 'opposite',
        categories: [
            '일반모2', '미세모2', '이중모2', '특일반모2', '특미세모2', '특이중모2', '특특특'
        ]
    }],
    yAxis: [{
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
        data: [97, 121, 89, 114.3, 103, 92.5, 77],
        yAxis: 1,
        xAxis: 1,
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
