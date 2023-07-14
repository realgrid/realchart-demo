const config = {
    title: "Line Series 01",
    xAxis: {
    },
    yAxis: {
    },
    series: {
        type: 'line',
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['def', 9], 
            ['지리산', 15.3], 
            ['zzz', 13],
            ['낙동강', 12.5]
        ]
    }
}

const config2 = {
    title: "Line Series 01",
    xAxis: {
        type: 'category'
    },
    yAxis: {
    },
    series: {
        type: 'line',
        pointLabel: true,
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['def', 9], 
            ['지리산', 15.3], 
            ['zzz', 13],
            ['낙동강', 12.5]
        ]
    }
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    // chart.model = RealChart.loadChart(config);
    chart.model = RealChart.loadChart(config2);
}
