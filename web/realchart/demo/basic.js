const config = {
    title: "Basic Real-Chart",
    xAxis: {
        // reversed: true,
        // type: 'linear',
        // type: 'category',
        // position: 'apposite'
        // position: 'base',
        // baseAxis: 1,
        grid: true
    },
    yAxis: {
        guides: [{
            type: 'line',
            value: 12,
            label: 'line guide'
        }, {
            type: 'range',
            start: 3,
            end: 6,
            label: {
                text: 'range guide',
                align: 'right'
            }
        }]
    },
    series: {
        pointLabel: {
            visible: true,
            // format: '${x}'
            text: '<b style="fill:red">${x}</b>'
        },
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['def', 9], 
            ['지리산', 14.3], 
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
    chart.model = RealChart.loadChart(config);
}
