/**
 * @demo
 * 
 */
const config = {
    options: {
        // animatable: false
    },
    title: "Linear Axis",
    xAxis: {
        title: 'X Axis',
        tick: {
        },
        label: {}
    },
    yAxis: {
        title: 'Y Axis',
        tick: {
        },
        label: {}
    },
    series: {
        type: 'bubble',
        colorByPoint: true,
        pointLabel: {
            visible: true,
            effect: 'outline',
            suffix: '%',
            style: { fill: '#008' }
        },
        pointColors: ['#ddd', '#ccc', '#bbb', '#aaa', '#999', '#888', '#777', '#666'],
        data: [
            [9, 2381, 63],
            [98, 7395, 89],
            [51, 5550, 73],
            [41, 9922, 14],
            [58, 5824, 20],
            [78, 2737, 34],
            [55, 15556, 53],
            [18, 9845, 70],
            [42, 7744, 28],
            [3, 5652, 59],
            [31, 5318, 97],
            [79, 11391, 63],
            [93, 12323, 23],
            [44, 13383, 22]
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
    createCheckBox(container, 'Y.Opposite', function (e) {
        config.yAxis.position = _getChecked(e) ? 'opposite': 'normal';
        chart.load(config);
    }, false);
    createCheckBox(container, 'X.reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'Y.reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
    createListBox(container, "X.startFit", ['value', 'tick'], function (e) {
        config.xAxis.startFit = _getValue(e);
        chart.load(config);
    }, 'value');
    createListBox(container, "X.endFit", ['value', 'tick'], function (e) {
        config.xAxis.endFit = _getValue(e);
        chart.load(config);
    }, 'value');
    createListBox(container, "X.minPadding", ['0.05', '0', '0.2'], function (e) {
        config.xAxis.minPadding = _getValue(e);
        chart.load(config);
    }, '0.05');
    createListBox(container, "X.maxPadding", ['0.05', '0', '0.2'], function (e) {
        config.xAxis.maxPadding = _getValue(e);
        chart.load(config);
    }, '0.05');
    createListBox(container, "Y.startFit", ['value', 'tick'], function (e) {
        config.yAxis.startFit = _getValue(e);
        chart.load(config);
    }, 'tick');
    createListBox(container, "Y.endFit", ['value', 'tick'], function (e) {
        config.yAxis.endFit = _getValue(e);
        chart.load(config);
    }, 'tick');
    createListBox(container, "Y.minPadding", ['0.05', '0', '0.2'], function (e) {
        config.yAxis.minPadding = _getValue(e);
        chart.load(config);
    }, '0.05');
    createListBox(container, "Y.maxPadding", ['0.05', '0', '0.2'], function (e) {
        config.yAxis.maxPadding = _getValue(e);
        chart.load(config);
    }, '0.05');
    createCheckBox(container, 'Y.tick.label.useSymbols', function (e) {
        config.yAxis.label.useSymbols = _getChecked(e);
        chart.load(config);
    }, true);
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
