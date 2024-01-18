/**
 * @demo
 * 
 */
const config = {
    options: {
        animatable: false,
        style: {
            backgroundImage: 'url(../assets/images/mountain.jpeg)'
       }
    },
    body: {
        zoomType: 'x',
        annotations: [{
            offsetX: 30,
            offsetY: 25,
            rotation: 5,
            text: 'Annotation Sample',
            style: {
                fill: 'white'
            },
            backgroundStyle: {
                fill: '#333',
                padding: '3px 5px',
                rx: 5,
                fillOpacity: 0.7
            }
        }, 
		{
            offsetX: 260,
            offsetY: 25,
            rotation: -5,
            text: 'Text',
            style: {
                fill: 'white'
            },
            backgroundStyle: {
                padding: '3px 5px',
                fill: 'blue',
                rx: 5,
                fillOpacity: 0.7
            }
        },{
            type: 'image',
            align: 'right',
            offsetX: 50,
            offsetY: 50,
            width: 100,
            imageUrl: '../assets/images/annotation.png'
        }],
    },
    exportOptions: {},
    title: "Line Big Data",
    xAxis: {
        tick: {
            stepInterval: 300,
        },
        minPadding: 0,
        maxPadding: 0,
        scrollBar: {
            visible: true
        }
    },
    yAxis: {
        minValue: 0,
        strictMax: 100
    },
    series: {
        type: 'line',
        marker: false,
        data: line_data
    },
    seriesNavigator: {
        visible: true
    },
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createCheckBox(container, 'Always Animate', function (e) {
        animate = _getChecked(e);
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
	createCheckBox(container, 'Inverted', function (e) {
            chart.inverted = _getChecked(e);
		}, false);
	createCheckBox(container, 'X Reversed', function (e) {
			config.xAxis.reversed = _getChecked(e);
			chart.load(config, animate);
		}, false);
	createCheckBox(container, 'Y Reversed', function (e) {
			config.yAxis.reversed = _getChecked(e);
			chart.load(config, animate);
		}, false);
	line(container);
	createCheckBox(container, 'exportOptions.visible', function (e) {
			config.exportOptions.visible = _getChecked(e);
			chart.load(config, animate);
		}, true);
    createCheckBox(
        container,
        'exportOptions.useLibrary',
        function (e) {
            config.exportOptions.useLibrary = _getChecked(e);
            chart.load(config, animate);
        },
        false
        );
	createCheckBox(container, 'exportOptions.hideNavigator', function (e) {
			config.exportOptions.hideNavigator = _getChecked(e);
			chart.load(config, animate);
		}, false);
	createCheckBox(container, 'exportOptions.hideScrollbar', function (e) {
			config.exportOptions.hideScrollbar = _getChecked(e);
			chart.load(config, animate);
		}, false);
	createCheckBox(container, 'exportOptions.hideZoomButton', function (e) {
			config.exportOptions.hideZoomButton = _getChecked(e);
			chart.load(config, animate);
		}, false);
	line(container);
	createListBox(container, "exportOptions.width", ['425', '850', '1275'], function (e) {
        config.exportOptions.width = Number(_getValue(e));
        chart.load(config);
    }, '850');
	createListBox(container, "exportOptions.scale", ['0.5', '1', '1.5'], function (e) {
        config.exportOptions.scale = Number(_getValue(e));
        chart.load(config);
    }, '1');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
