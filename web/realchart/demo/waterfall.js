const config = {
    options: {
    },
    title: "Waterfall Series",
    xAxis: {
        title: "일일 Daily fat",
        grid: true,
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
    },
    series: {
        type: 'waterfall',
        pointLabel: {
            visible: true,
            position: 'inside',
            effect: 'outline'
        },
        data: [{
            name: 'Start',
            y: 120000
        }, {
            name: 'Product Revenue',
            y: 569000
        }, {
            name: 'Service Revenue',
            y: 231000
        }, {
            name: 'Positive Balance',
            isSum: true,
        }, {
            name: 'Fixed Costs',
            y: -342000
        }, {
            name: 'Variable Costs',
            y: -233000
        // }, {
        //     name: 'Positive Balance2',
        //     isSum: true,
        }, {
            name: 'Balance',
            isSum: true,
        }]
    }
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
