/**
 * @demo
 * 
 */
const config = {
    options: {
        // inverted: true
    },
    title: "Dumbbell Null Point",
    xAxis: {
        grid: true,
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
    },
    series: {
        type: 'dumbbell',
        pointLabel: {
            visible: true,
            // format: '${x}'
            // text: '<b style="fill:red">${x}</b>'
        },
        data: [
            [null],
            [-16.7, 10.6],
            [-4.7, null],
            [-4.4, 16.8],
            [-2.1, 27.2],
            [],
            [6.5, 29.1],
            [4.7, 25.4],
            [4.3, 21.6],
            [-3.5, 15.1],
            [-9.8, 12.5],
            [-11.5, 8.4]
        ]
    }
}
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.update(config);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
