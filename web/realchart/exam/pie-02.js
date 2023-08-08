const config = {
    type: 'pie',
    title: "Pie Series 02",
    xAxis: {
    },
    yAxis: {
    },
    series: [{
        size: '80%',
        innerSize: '50%',
        pointLabel: {
            visible: true,
            style: {
                fill: '#eee'
            }
        },
        data: [ 
            { name: 'moon', y: 53, sliced: false }, 
            { name: 'yeon', y: 97, color: 'blue' }, 
            { name: 'lim', y: 17}, 
            { name: 'moon', y: 9}, 
            { name: 'hong', y: 13 }, 
            { name: 'america', y: 23}, 
            { name: 'asia', y: 29}, 
        ],
    }, {
        size: '60%',
        innerSize: '40%',
        pointLabel: {
            visible: true,
            style: {
                fill: '#eee'
            }
        },
        data: [ 
            { name: 'moon2', y: 33, sliced: false }, 
            { name: 'yeon2', y: 27, color: 'green' }, 
            { name: 'lim2', y: 57}, 
            { name: 'moon2', y: 29}, 
            { name: 'hong2', y: 13 }, 
            { name: 'america2', y: 23}, 
            { name: 'asia2', y: 29}, 
        ],
    }]
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
