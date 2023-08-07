const config = {
    title: "Axis Breaks - 01",
    xAxis: {
        title: "일일 Daily fat",
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        grid: true,
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
        break: [{
            from: 500,
            to: 3000,
            inclusive: false,
            space: 5
        }]
    },
    series: [{
        name: 'column1',
        pointLabel: true,
        // pointWidth: '100%',
        data: [499, 128, 180, 345, 3050, 3590, 3840, 3630, 3120, 520, 240, 80]
    }, {
        name: 'column3',
        pointLabel: true,
        data: [64, 138, 164, 408, 3120, 3540, 3875, 3420, 720, 320, 160, 20]
    }]
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
