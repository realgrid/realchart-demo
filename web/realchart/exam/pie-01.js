const config = {
    title: "Pie Series 01",
    legend: {
        position: 'inside',
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
        type: 'pie',
        pointLabel: {
            visible: true,
            effect: 'outline',
            style: {
                // fill: '#eee'
            }
        },
        data: [ 
            { name: 'moon', y: 53, sliced: true }, 
            { name: 'yeon', y: 97, color: '#0088ff' }, 
            { name: 'lim', y: 17}, 
            { name: 'moon', y: 9}, 
            { name: 'hong', y: 13 }, 
            { name: 'america', y: 23}, 
            { name: 'asia', y: 29}, 
            // 23,
            // 7,
            // 17,
            // 13
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
