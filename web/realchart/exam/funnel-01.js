const config = {
    title: "Funnel Series 01",
    legend: {
        position: 'right',
        layout: 'vertical',
        style: {
            marginTop: '16px',
            marginRight: '20px'
        }
    },
    xAxis: {
    },
    yAxis: {
    },
    series: {
        type: 'funnel',
        // reversed: true,
        // neckWidth: 0,
        // neckHeight: 0,
        pointLabel: {
            visible: true,
            style: {
                fill: '#eee'
            }
        },
        data: [ 
            { name: 'moon', y: 53, sliced: true }, 
            { name: 'yeon', y: 97, color: '#0088ff' }, 
            { name: 'lim', y: 17}, 
            { name: 'moon', y: 9}, 
            { name: 'hong', y: 13 }, 
            { name: 'america', y: 23}, 
            { name: 'asia', y: 29}
        ],
    }
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
