/**
 * @demo
 * 
 */

const ballsData = [
    { angle: 85, hits: 1 },
    { angle: 80, hits: 3 },
    { angle: 65, hits: 13 },
    { angle: 60, hits: 1 },
    { angle: 55, hits: 4 },
    { angle: 50, hits: 6 },
    { angle: 45, hits: 8 },
    { angle: 40, hits: 6 },
    { angle: 35, hits: 14 },
    { angle: 30, hits: 11 },
    { angle: 25, hits: 11 },
    { angle: 20, hits: 17 },
    { angle: 15, hits: 15 },
    { angle: 10, hits: 16 },
    { angle: 5, hits: 15 },
    { angle: 0, hits: 15 },
    { angle: -5, hits: 9 },
    { angle: -10, hits: 9 },
    { angle: -15, hits: 11 },
    { angle: -20, hits: 6 },
    { angle: -25, hits: 22 },
    { angle: -30, hits: 5 },
    { angle: -35, hits: 3 },
    { angle: -40, hits: 7 },
    { angle: -45, hits: 3 },
    { angle: -55, hits: 1 },
    { angle: -65, hits: 2 },
];


const config = {
    polar: true,
    options: {
        // animatable: false
    },
    title: "Jose Reyes Mets",
    xAxis: {
        type: 'linear',
        minValue: -180,
        maxValue: 180,
        // strictMin: 0,
        // strictMax: 360,
        tick: {
            stepInterval: 5,
        },
        // step: 5,
        grid: {
            // visible: false,
        }
    },
    yAxis: {
        // line: true,
        label: true,
        guide: [{
            type: 'line',
            value: 5.5,
            style: {
                stroke: 'red'
            }
        }]
    },
    body: {
        // startAngle: 90,
        totalAngle: 180,
    },
    series: [{
        type: 'bar',
        pointLabel: {
            visible: !true,
        },
        // pointWidth: 0.1,
        data: ballsData,
        xField: 'angle',
        yField: 'hits',
    }]
}

let animate;
let chart;

function setActions(container) {
	createCheckBox(
		container,
		'Debug',
		function (e) {
			RealChart.setDebugging(_getChecked(e));
			chart.render();
		},
		false
	);
	createCheckBox(
		container,
		'Always Animate',
		function (e) {
			animate = _getChecked(e);
		},
		false
	);
	createButton(container, 'Test', function (e) {
        alert('hello');
    });
    createListBox(container, "X.startOffset", ['0', '0.5'], function (e) {
        config.xAxis.startOffset = _getValue(e);
        chart.load(config);
    }, '0');
	createCheckBox(
		container,
		'body.circular',
		function (e) {
            config.body.circular = _getChecked(e);
			chart.load(config, animate);
		},
		true
	);
    createCheckBox(
		container,
		'polar',
		function (e) {
            config.polar = _getChecked(e);
			chart.load(config, animate);
		},
		true
	);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
