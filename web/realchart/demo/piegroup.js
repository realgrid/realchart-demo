/**
 * @demo
 *
 */
const config = {
    templates: {
        series:  {
            pointStyle2: {
                stroke: 'white'
            }
        }
    },
	title: 'Pie Group',
	options: {
		// animatable: false
	},
	series: {
        type: 'piegroup',
        children: [
            {
                template: 'series',
                name: 'pie1',
                pointLabel: {
                    visible: true,
                    position: 'inside',
                    effect: 'outline',
                },
                // pointWidth: '100%',
                data: [11, 22, 15, 9, 13, 27],
            },
            {
                template: 'series',
                name: 'pie2',
                pointLabel: {
                    visible: true,
                    position: 'inside',
                    effect: 'outline',
                },
                data: [15, 19, 19, 6, 21, 21],
            },
            {
                template: 'series',
                name: 'pie3',
                pointLabel: {
                    visible: true,
                    position: 'inside',
                    effect: 'outline',
                },
                data: [13, 17, 15, 11, 23, 17],
            },
        ],
    },
};

let animate = false;
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
		alert('hello2');
	});
    createListBox(container, "options.palette", ['default', 'warm', 'cool', 'forest', 'gray'], function (e) {
        config.options.palette = _getValue(e);
        chart.load(config, animate);
    }, 'default');
    createCheckBox(container, 'Legend', function (e) {
        config.legend.visible = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createListBox(container, "Legend.location", ['bottom', 'top', 'right', 'left'], function (e) {
        config.legend.location = _getValue(e);
        chart.load(config, animate);
    }, 'bottom');
    line(container);
    createListBox(container, "series.startAngle", [0, 90, 180, 270], function (e) {
        config.series.startAngle = _getValue(e);
        chart.load(config, animate);
    }, 0);
    createListBox(container, "series.totalAngle", [360, 270, 225, 180], function (e) {
        config.series.totalAngle = _getValue(e);
        chart.load(config, animate);
    }, 360);
    createCheckBox(container, 'series.clockwise', function (e) {
        config.series.clockwise = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createListBox(container, "series.radius", ['30%', '35%', '40%', '45%'], function (e) {
        config.series.radius = _getValue(e);
        chart.load(config, animate);
    }, '40%');
    createListBox(container, "series.centerX", ['30%', '40%', '50%', '60%'], function (e) {
        config.series.centerX = _getValue(e);
        chart.load(config, animate);
    }, '50%');
    createListBox(container, "series.centerY", ['45%', '50%', '55%'], function (e) {
        config.series.centerY = _getValue(e);
        chart.load(config, animate);
    }, '50%');
    line(container);
    createListBox(container, "series.pointLabel.position", ['auto', 'outside'], function (e) {
        config.series.children[2].pointLabel.position = _getValue(e);
        chart.load(config, animate);
    }, 'auto');
}

function init() {
	console.log('RealChart v' + RealChart.getVersion());
	// RealChart.setDebugging(true);
    RealChart.setLogging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
