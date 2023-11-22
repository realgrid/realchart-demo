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
        ]
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
	createCheckBox(
		container,
		'body.circular',
		function (e) {
            config.body.circular = _getChecked(e);
			chart.load(config, animate);
		},
		true
	);
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
