/**
 * @demo
 */
const config = {
    options: {
        // theme: 'dark',
        // animatable: false,
        credits: {
            // visible: false,
            // verticalAlign: 'top'
            // align: 'center'
        }
    },
    title: "Circle Guage",
    gauge: {
        name: 'gauge1',
        value: Math.random() * 100,
        // radius: '30%',
        // clockwise: false,
        // startAngle: -90,
        // sweepAngle: 300,
        // valueRadius: '110%',
        // valueThickness: '100%',
        // minValue: 30,
        // maxValue: 170,
        rim: {
        },
        valueRim: {
            // stroked: true,
            ranges: [{
                toValue: 30,
                color: '#0098ff'
            }, {
                toValue: 70,
                color: '#66d0ff'
            }, {
                color: '#ff5c35'
            }],
        },
        scale: {
            visible: true,
        },
        band: {
            // thickness: '100%',
            visible: true,
            ranges: [{
                toValue: 20,
                color: '#0098ff',
            }, {
                toValue: 40,
                color: '#66d0ff',
            }, {
                toValue: 60,
                color: '#ff5c35'
            }, {
                toValue: 80,
                color: '#ff9f00'
            }, {
                color: '#ffd938'
            }]
        },
        label: {
            // suffix: '%',
            numberFormat: '#0.0',
            text: '<t style="fill:#262626">${value}</t><t style="font-size:24px;">%</t><br><t style="font-size:20px;font-weight:normal">Gauge Test</t>',
            text2: '<t style="font-size:20px;font-weight:normal">Gauge Test</t><br><t style="fill:blue">${value}</t><t style="font-size:24px;">%</t>',
            style: {
                fontFamily: 'Arial',
                fontWeight: 'bold',
            },
        }
    }
}

let animate;
let chart;
let timer;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'label.animatable', function (e) {
        config.gauge.label.animatable = _getChecked(e);
        chart.load(config);
    }, true);
    createListBox(container, "startAngle", [0, 90, 180, 225, 270], function (e) {
        config.gauge.startAngle = _getValue(e);
        chart.load(config, animate);
    }, 0);
    createListBox(container, "sweepAngle", [360, 270, 225, 180], function (e) {
        config.gauge.sweepAngle = _getValue(e);
        chart.load(config, animate);
    }, 360);
    createCheckBox(container, 'clockwise', function (e) {
        config.gauge.clockwise = _getChecked(e);
        chart.load(config);
    }, true);
    createListBox(container, "innerRadius", ['', '70%', '80%', '85%', '90%', '95%'], function (e) {
        config.gauge.innerRadius = _getValue(e);
        chart.load(config, animate);
    }, '');
    createListBox(container, "valueRadius", ['', '80%', '90%', '100%', '110%', '120%'], function (e) {
        config.gauge.valueRadius = _getValue(e);
        chart.load(config, animate);
    }, '');
    createListBox(container, "valueRim.thickness", ['', '50%', '100%', '150%', '200%'], function (e) {
        config.gauge.valueRim.thickness = _getValue(e);
        chart.load(config, animate);
    }, '');
    createCheckBox(container, 'rim', function (e) {
        config.gauge.rim.visible = _getChecked(e);
        chart.load(config);
    }, true);
    createCheckBox(container, 'scale', function (e) {
        config.gauge.scale.visible = _getChecked(e);
        chart.load(config);
    }, true);
    createListBox(container, "scale.position", ['default', 'opposite', 'inside'], function (e) {
        config.gauge.scale.position = _getValue(e);
        chart.load(config);
    }, 'default');
    createCheckBox(container, 'band', function (e) {
        config.gauge.band.visible = _getChecked(e);
        chart.load(config);
    }, true);
    createListBox(container, "band.position", ['default', 'opposite', 'inside'], function (e) {
        config.gauge.band.position = _getValue(e);
        chart.load(config);
    }, 'default');
    createButton(container, 'Run', function(e) {
        clearInterval(timer);
        timer = setInterval(() => {
            chart.gauge.updateValue(Math.random() * 100);
        }, 2000);
    });
    createButton(container, 'Stop', function(e) {
        clearInterval(timer);
    });
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
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
