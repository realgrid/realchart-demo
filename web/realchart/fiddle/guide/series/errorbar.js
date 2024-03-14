const config = {
    title: "Error Bar",
    options: {
    },
    xAxis: {
        title: 'X Axis',
        categories: ['쓰리엠', '아디다스', '디즈니', 'Amazon', '이마트', 'Youtube'],
    },
    yAxis: {
        title: 'Y Axis',
    },
    series: [{
        pointLabel: {
            visible: true,
            position: 'inside',
            effect: 'outline',
        },
        data: [11, 22, 15, 9, 13, 27]
    }, {
        type: 'errorbar',
        pointLabel: true,
        data: [[10, 12], [20, 23], [14, 16], [8, 11], [12, 14], [25, 26]],
        color: '#333',
    }]
}


let chart;

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    RealChart.setLogging(false);

    chart = RealChart.createChart(document, 'realchart', config);
}
