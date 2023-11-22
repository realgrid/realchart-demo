/**
 * @demo
 * 
 */
const config = {
    title: "Bar Range Series",
    options: {
        // animatable: false,
    },
    xAxis: {
        grid: true,
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
    },
    series: {
        type: 'barrange',
        pointLabel: {
            visible: true,
            // format: '${x}'
            // text: '<b style="fill:red">${x}</b>'
        },
        data: [
            [-13.9, 5.2],
            [-16.7, 10.6],
            [-4.7, 11.6],
            [-4.4, 16.8],
            [-2.1, 27.2],
            [5.9, 29.4],
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
        chart.render();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
    createButton(container, 'PNG', function (e) {
		chart.exportImage();
	});
	createButton(container, 'JPG', function (e) {
		chart.exportImage({type: 'jpg'});
	});
	createButton(container, 'JPEG', function (e) {
		chart.exportImage({type: 'jpeg'});
	});
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    console.log('Animatable', config.options.animatable);
    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
