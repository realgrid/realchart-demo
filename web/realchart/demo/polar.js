/**
 * @demo
 * 
 */
const config = {
    polar: true,
    options: {
        // animatable: false
    },
    title: "Polar Chart",
    xAxis: {
        categories: [
            '성남시', '용인시', '수원시', '일산시', '화성시', '평택시'
        ],
        // startOffset: 0.5,
    },
    yAxis: {
        // line: true,
        label: true,
        guides: [{
            type: 'line',
            value: 5.5,
            style: {
                stroke: 'red'
            }
        }]
    },
    body: {
    },
    series: [{
        type: 'bar',
        pointLabel: {
            visible: true,
            position: 'outside'
        },
        data: [ 7, 11, 9, 14.3, 13, 12.5 ]
    }, {
        type: 'area',
        pointLabel: true,
        data: [ 13, 9, 11, 12.3, 11, 15.5 ]
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
    createListBox(container, "X.startAngle", ['0', '90', '180', '270'], function (e) {
        config.xAxis.startAngle = _getValue(e);
        chart.load(config);
    }, '0');
    createListBox(container, "X.totalAngle", ['360', '270', '180'], function (e) {
        config.xAxis.totalAngle = _getValue(e);
        chart.load(config);
    }, '360');
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
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
