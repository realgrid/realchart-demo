const config = {
    options: {
        // animatable: false
    },
    title: {
        text: '2017년 3/4분기',
        gap: 10,
        backgroundStyle: {
            fill: 'black',
            rx: '3px'
        },
        style: {
            fill: '#fff',
            fontSize: '16px',
            padding: '2px 5px',
        }
    },
    subtitle: {
        text: '모바일 트래픽 분석',
        style: {
            fill: 'black',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '10px'
        }
    },
    series: [{
        type: 'pie',
        radius: '40%',
        innerRadius: '50%',
        innerText: '<t style="fill:#000;font-weight:bold;font-size:24px">OS</t>',
        legendByPoint: true,
        pointLabel: {
            text: '${x}<br>${y}%',
            visible: true,
            numberFormat: '#.00',
            style: {
                fill: '#fff',
                stroke: '#d3d3d3',
                strokeWidth: '0.2px',
                fontSize: '14px'
            }
        },
        data: [ 
            { x: 'Android', y: 53.51, sliced: true }, 
            { x: 'iOS', y: 29.14 }, 
            { x: 'Windows', y: 10.72}, 
            { x: '기타', y: 6.63}, 
        ],
        onPointClick: (arg) => {
            config.series[0].data.forEach(value => {
                value.sliced = value.x === arg.x ? true : false;
            });
            chart.load(config, false);
        }
    }]
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
    createListBox(container, "Line Type", ['default', 'spline', 'step'], function (e) {
        config.series.lineType = _getValue(e);
        chart.load(config, animate);
    }, 'default');
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
