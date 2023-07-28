const config = {
    title: "Bar Series 01",
    options: {
        inverted: true,
    },
    xAxis: {
        title: 'X Axis',
        // grid: true,
    },
    yAxis: {
        title: 'Y Axis',
        // reversed: true,
        guides: [{
            type: 'line',
            value: 5.5,
            label: "Hello?",
            style: {
                stroke: 'red'
            }
        }, {
            type: 'range',
            start: 9,
            end: 11.5,
            label: {
                text: 'range guide',
                align: 'right',
                valign: 'bottom'
            }
        }]
    },
    series: {
        type: 'bar',
        pointLabel: {
            visible: true,
            position: 'head',
            // text: '<b style="fill:red">${x}</b>'
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
