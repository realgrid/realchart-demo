/**
 * @demo
 * 
 */
const config = {
    options: {
        // animatable: false
    },
    title: "Bubble Series",
    tooltip: {
        followPointer: true
    },
    xAxis: {
        title: 'xAxis'
    },
    yAxis: {
        title: 'yAxis'
    },
    series: {
        type: 'bubble',
        pointLabel: {
            visible: true,
            suffix: 'm',
            effect: 'outline',
            // position: 'outside'
        },
        sizeMode: 'width',
        // shape: 'rectangle',
        radius: 0.1,
        data: [
            [9, 81, 63],
            [98, 5, 89],
            [51, 50, 73],
            [41, 22, 14],
            [58, 24, 20],
            [78, 37, 34],
            [55, 56, 53],
            [18, 45, 70],
            [42, 44, 28],
            [3, 52, 59],
            [31, 18, 97],
            [79, 91, 63],
            [93, 23, 23],
            [44, 83, 22]
        ]
    }
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
	createCheckBox(
		container,
		'Always Animate',
		function (e) {
			animate = _getChecked(e);
		},
		false
	);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config);
    }, animate);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config);
    }, animate);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config);
    }, animate);
    createCheckBox(container, 'Outlined Label', function (e) {
        config.series.pointLabel.effect = _getChecked(e) ? 'outline' : 'none';
        chart.load(config);
    }, animate);
    createCheckBox(container, 'ColorByPoint', function (e) {
        config.series.colorByPoint = _getChecked(e);
        chart.load(config);
    }, animate);
	createListBox(
		container,
		'sizeMode',
		['width', 'area'],
		function (e) {
			config.series.sizeMode = _getValue(e);
			chart.load(config, animate);
		},
		'width'
	);
	createListBox(
		container,
		'shape',
		['', 'circle', 'square', 'diamond', 'triangle', 'itriangle', 'star', 'rectangle'],
		function (e) {
			config.series.shape = _getValue(e);
			chart.load(config, animate);
		},
		''
	);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
