/**
 * @demo
 * 
 * 축의 tick 위치증에 표시되는 text 라벨에 관련된 속성들을 알아본다.
 */
export const config = {
    options: {
        // animatable: false
    },
    title: "Axis Labels",
    xAxis: {
        title: 'X Axis',
        categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', '마리아', 'Leon', 'Anna', 'Tim', 'Laura'],
        categories_s: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', '마리아', 'Leon', 'Anna', 'Tim', 'Laura'],
        categories_l: ['Alexander-Long', 'Marie-Long', 'Maximilian-Long', 'Sophia-Long', 'Lukas-Long', '마리아-Long', 'Leon-Long', 'Anna-Long', 'Tim-Long', 'Laura-Long'],
        grid: true,
        label: {
            // rotation: -90
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
    }, false);
    createCheckBox(container, 'Always Animate', function (e) {
        animate = _getChecked(e);
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X.reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y.reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X.opposite', function (e) {
        config.xAxis.position = _getChecked(e) ? 'opposite': 'normal';
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y.opposite', function (e) {
        config.yAxis.position = _getChecked(e) ? 'opposite': 'normal';
        chart.load(config, animate);
    }, false);
    createListBox(container, "X.step", ['0', '1', '2', '3'], function (e) {
        config.xAxis.label.step = +_getValue(e);
        chart.load(config);
    }, '0');
    createListBox(container, "X.label.rows", ['0', '1', '2', '3'], function (e) {
        config.xAxis.label.rows = +_getValue(e);
        chart.load(config);
    }, '0');
    createListBox(container, "X.label.rotation", ['NaN', '0', '-90', '-80', '-70', '-60', '-50', '-45', '-40', '-30', '-20', '-16'], function (e) {
        config.xAxis.label.rotation = +_getValue(e);
        chart.load(config);
    }, 'NaN');
    createListBox(container, "X.label.rotation.2", ['NaN', '0', '90', '80', '70', '60', '50', '45', '40', '30', '20', '16'], function (e) {
        config.xAxis.label.rotation = +_getValue(e);
        chart.load(config);
    }, 'NaN');
    createListBox(container, "X.categories", ['short', 'long'], function (e) {
        config.xAxis.categories = _getValue(e) === 'long' ? config.xAxis.categories_l : config.xAxis.categories_s;
        chart.load(config);
    }, 'short');
    createListBox(container, "X.labe.autoArrange", ['none', 'rotate', 'step', 'rows'], function (e) {
        config.xAxis.label.autoArrange = _getValue(e);
        chart.load(config);
    }, 'rotate');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
