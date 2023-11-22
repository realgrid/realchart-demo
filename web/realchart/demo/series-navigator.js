/**
 * @demo
 * 
 */
const config = {
    options: {
        // animatable: false
    },
    title: {
        text: 'Series Navigator (Working...)',
        style: {
            fontSize: '1.2em'
        },
        backgroundStyle: {
            rx: '5px'
        }
    },
    body: {
        style: {
            // stroke: 'none'
        }
    },
    xAxis: {
        // type: 'linear',
        title: {
            visible: true,   
            text: 'Period',
        },
        crosshair: true,
        padding: 0,
        label: {
            autoArrange: 'step', //'step',
            // step: 2,
        },
        line: {
            style: {
                stroke: 'black',
                strokeWidth: 2
            }
        },
        grid: {
            endVisible: true
        }
    },
    yAxis: {
        title: 'Hestavollane',
        line: true
    },
    series: {
        // type: 'line',
        marker: {
            visible: true,
            shape: 'diamond',
            radius: 5,
            style: {
                stroke: 'white'
            }
        },
        // xStart: "2023-07-12",
        // xStep: 1000 * 60 * 60,
        data: [4.5, 5.1, 4.4, 3.7, 4.2, 3.7, 4.3, 4, 5, 4.9,
            4.8, 4.6, 3.9, 3.8, 2.7, 3.1, 2.6, 3.3, 3.8,
            4.1, 1, 1.9, 3.2, 3.8, 4.2, 3.8, 3.3, 4.7,
            4.8, 4.6, 3.9, 3.8, 2.7, 3.1, 2.6, 3.3, 3.8,
            4.8, 4.6, 3.9, 3.8, 2.7, 3.1, 2.6, 3.3, 3.8,
            4.1, 1, 1.9, 3.2, 3.8, 4.2, 3.8, 3.3, 4.7, 4.1, 3.9,
            5, 4.1, 3.9, 3.5, 2.7, 3.1, 2.6, 3.3, 3.8,
            4.8, 4.6, 3.9, 3.8, 2.7, 3.1, 2.6, 3.3, 3.8,
        ]
    },
    // legend: true,
    seriesNavigator: {
        visible: true
    }
}

let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createButton(container, 'Test', function(e) {
        // alert('hello');
    });
    createListBox(container, "options.theme", ['', 'dark'], function (e) {
        config.options.theme = _getValue(e);
        chart.load(config);
    }, 'default');
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

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
