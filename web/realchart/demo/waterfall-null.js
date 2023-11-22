/**
 * @demo
 * 
 */
const config = {
    options: {
        // animatable: false
    },
    title: "Waterfall Null Point",
    xAxis: {
        title: "일일 Daily fat",
        grid: true,
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
    },
    series: {
        type: 'waterfall',
        pointPadding: 0.15,
        pointLabel: {
            visible: true,
            position: 'inside',
            effect: 'outline'
        },
        data: [{
            name: 'Start',
            y: 120000
        }, {
            name: 'Product Revenue',
            y: null//569000
        }, {
            name: 'Service Revenue',
            y: 231000
        }, {
            name: 'Positive Balance',
            isSum: true,
        }, {
            name: 'Fixed Costs',
            y: -342000
        }, {
            name: 'Variable Costs',
            y: -233000
        // }, {
        //     name: 'Positive Balance2',
        //     isSum: true,
        }, {
            name: 'Balance',
            isSum: true,
        }]
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

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
