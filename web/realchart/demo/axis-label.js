const config = {
    options: {
        animatable: false
    },
    title: "Heatmap - Axis Label",
    xAxis: {
        title: 'X Axis',
        categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', '마리아', 'Leon', 'Anna', 'Tim', 'Laura'],
        grid: true,
        label: {
            rotation: -90
        }
    },
    yAxis: {
        title: 'Y Axis',
        grid: true
    },
    series: {
        pointLabel: {
            visible: true,
            // position: 'head',
            // offset: 10,
            // text: '<b style="fill:red">${x}</b>',
            effect: 'outline',// 'background',
            style: {
            },
            // backgroundStyle: {
            //     fill: '#004',
            //     padding: '5px'
            // }
        },
        data: [
            31231, 12311, 53453, 43242, 19953, 12000, 39021, 41001, 37800, 25123 
        ],
        style: {
            // fill: 'yellow'
        }
    }
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, true);
    createCheckBox(container, 'Always Animate', function (e) {
        animate = _getChecked(e);
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.update(config, animate);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.update(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.update(config, animate);
    }, false);
    createCheckBox(container, 'X.Opposite', function (e) {
        config.xAxis.position = _getChecked(e) ? 'opposite': 'normal';
        chart.update(config, animate);
    }, false);
    createListBox(container, "X.rotation", ['0', '-90', '-80', '-70', '-60', '-50', '-45', '-40', '-30', '-20', '-16'], function (e) {
        config.xAxis.label.rotation = _getValue(e);
        chart.update(config);
    }, '-90');
    createListBox(container, "X.rotation", ['0', '90', '80', '70', '60', '50', '45', '40', '30', '20', '16'], function (e) {
        config.xAxis.label.rotation = _getValue(e);
        chart.update(config);
    }, '-90');
}

function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
