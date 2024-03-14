
const config = {
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
        tooltipText: 'low: ${low}<br>save: ${save}',
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
        }, {
            name: 'Balance',
            isSum: true,
        }]
    }
}

let chart;

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    RealChart.setLogging(false);

    chart = RealChart.createChart(document, 'realchart', config);
}
