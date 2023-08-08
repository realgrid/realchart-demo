const config = {
    title: {
        text: "Real-Chart Titles",
        style: {
            fill: 'white'
        },
        backgroundStyle: {
            fill: '#333',
            stroke: '#333',
            borderRadius: '5px',
            padding: '4px'
        }
    },
    xAxis: {
        // reversed: true,
        // type: 'linear',
        // type: 'category',
        // position: 'apposite'
        // position: 'base',
        // baseAxis: 1,
        title: {
            text: 'X Axis',
            style: {
            },
            backgroundStyle: {
                padding: '5px',
                fill: 'green',
                borderRadius: '5px'
            }
        },
        grid: true
    },
    yAxis: {
        title: {
            text: 'Y Axis',
            style: {
            },
            backgroundStyle: {
                padding: '5px',
                fill: 'green',
                borderRadius: '5px'
            }
        },
        guide: [{
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
            position: 'head',
            // outline: false,
            // offset: 10,
            // text: '<b style="fill:red">${x}</b>'
        },
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['def', 9], 
            ['지리산', 14.3], 
            ['zzz', 13],
            ['낙동강', 12.5]
        ],
        style: {
            // fill: 'yellow'
        }
    }
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
