/**
 * @demo
 * 
 */
const config = {
    options: {
        // animatable: false
    },
    title: "Bubble Series - Null",
    xAxis: {
        title: 'xAxis'
    },
    yAxis: {
        title: 'yAxis',
    },
    series: {
        type: 'bubble',
        pointLabel: {
            visible: true,
            suffix: 'm'
        },
        data: [
            [9, 81, 63],
            [98, 5, 89],
            [51, 50, 73],
            [41, 22, 14],
            [58, 24, 20],
            [78, 37, 34],
            [55, 56, 53],
            [null, null, null],
            [null, null, 28],
            [3, 52, null],
            [31, 18, 97],
            [79, 91, 63],
            [93, 23, 23],
            [44, 83, 22]
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
    createCheckBox(container, 'ColorByPoint', function (e) {
        config.series.colorByPoint = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'Outlined Label', function (e) {
        config.series.pointLabel.effect = _getChecked(e) ? 'outline' : 'none';
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

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
