const config = {
    title: "Column Series",
    xAxis: {
        title: "일일 Daily fat",
        categories: ['쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도'],
        grid: true,
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
    },
    series: [{
        name: 'column1',
        pointLabel: true,
        // pointWidth: '100%',
        data: [11, 22, 15, 9, 13, 27]
    }]
}

function setActions(container) {
    createButton(container, 'Test', function(e) {
        alert('hello');
    })
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);

    setActions('actions')
}
