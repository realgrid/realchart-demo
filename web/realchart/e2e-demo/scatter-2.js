/**
 * @demo
 *
 */
const config = {
	type: 'scatter',
	options: {
		// palette: 'gray'
	},
	title: 'Scatter Series',
	xAxis: {
		title: '나이',
		baseValue: null,
	},
	yAxis: {
		title: '최대 심박수 (thalachh)',
	},
	series: {
        name: '남자',
        data: heart_data.slice(0,600).filter(d => d.sex===1),
        xField: 'age',
        yField: 'thalachh',
        // pointLabel: true
    },
};

let animate = false;
let chart;
let rotater;
let resizer;

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
	createCheckBox(
		container,
		'Inverted',
		function (e) {
			config.inverted = _getChecked(e);
			chart.load(config);
		},
		animate
	);
	createCheckBox(
		container,
		'X Reversed',
		function (e) {
			config.xAxis.reversed = _getChecked(e);
			chart.load(config);
		},
		false
	);
	createCheckBox(
		container,
		'Y Reversed',
		function (e) {
			config.yAxis.reversed = _getChecked(e);
			chart.load(config);
		},
		animate
	);
    createCheckBox(container, 'ColorByPoint', function (e) {
        config.series.colorByPoint = _getChecked(e);
        chart.load(config);
    }, animate);
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
	createListBox(
		container,
		'rotation',
		['-45', '-30', '0', '30', '45'],
		function (e) {
			config.series.rotation = _getValue(e);
			chart.load(config, animate);
		},
		'0'
	);
	createButton(container, 'Rotate', function (e) {
        clearInterval(rotater);
		rotater = setInterval(() => {
            chart.series.set('rotation', (+chart.series.get('rotation') || 0) + 10);
        }, 100)
	});
	createButton(container, 'Stop', function (e) {
        clearInterval(rotater);
	});
	createListBox(
		container,
		'radius',
		['5', '7', '10', '15', '20'],
		function (e) {
			config.series.radius = _getValue(e);
			chart.load(config, animate);
		},
		'0'
	);
	createButton(container, 'Resize', function (e) {
        clearInterval(resizer);
		rotater = setInterval(() => {
            chart.series.set('radius', (+chart.series.get('radius') || 0) + (Math.random() * 2 - 1));
        }, 100)
	});
	createButton(container, 'Stop', function (e) {
        clearInterval(resizer);
	});
}

function init() {
	console.log('RealChart v' + RealChart.getVersion());
	// RealChart.setDebugging(true);
    RealChart.setLogging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
