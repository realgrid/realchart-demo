const config = {
    type: 'bar',
    title: "Bar Multi Group",
    xAxis: {
        title: "일일 Daily fat",
        categories: ['쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도']
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
    },
    groups: [{
        groupPadding: 0.1,
        // layout: 'overlap',
        // layout: 'stack',
    }, {
        groupPadding: 0.1,
    }],
    series: [{
        name: 'column1',
        // pointWidth: '100%',
        data: [11, 22, 15, 9, 13, 27]
    }, {
        name: 'column2',    
        data: [15, 19, 19, 6, 21, 21]
    }, {
        name: 'column3',
        data: [13, 17, 15, 11, 23, 17]
    }, {
        group: 1,
        name: 'column4',
        data: [13, 17, 15, 11, 23, 17]
    }, {
        group: 1,
        name: 'column5',
        data: [15, 19, 19, 6, 21, 21]
    }]
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
