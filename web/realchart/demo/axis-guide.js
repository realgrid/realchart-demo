/**
 * @demo
 * 
 * 축의 특정한 위치나 범위를 강조해서 표시하는 방법.
 */
const config = {
    // inverted: true,
    options: {
        animatable: false
    },
    title: "Axis Guides",
    legend: true,
    xAxis: {
        // type: 'category',
        tick: true,
        // position: 'apposite'
        // position: 'base',
        // baseAxis: 1,
        title: 'X Axis',
        grid: true
    },
    yAxis: {
        tick: true,
        title: 'Y Axis',
        guides: [{
            type: 'line',
            visible: false,
            // front: true,
            value: 12,
            label: {
                text: 'line guide',
                effect: 'background',
                style: {
                    fill: 'white',
                },
                backgroundStyle: {
                    fill: 'black',
                    padding: '2px 5px',
                    // rx: 3
                }
            },
            style: {
                stroke: 'blue',
                strokeDasharray: '4'
            }
        }, {
            type: 'range',
            front: true,
            start: 3,
            end: 6,
            label: {
                text: 'range guide',
                align: 'right',
                style: {
                    fill: 'red'
                }
            }
        }]
    },
    series: {
        pointLabel: {
            visible: true,
            position: 'head',
            // offset: 10,
            // text: '<b style="fill:red">${x}</b>',
            effect: 'outline',// 'background',
            style: {
            },
        },
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['def', 9], 
            ['지리산', 14.3], 
            ['zzz', 13],
            ['낙동강', 12.5]
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
        chart.render();
    }, false);
    createCheckBox(container, 'Always Animate', function (e) {
        animate = _getChecked(e);
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'X.Opposite', function (e) {
        config.xAxis.position = _getChecked(e) ? 'opposite': 'normal';
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
    line(container);
    createCheckBox(container, 'guide[0].front', function (e) {
        config.yAxis.guides[0].front = _getChecked(e);
        chart.load(config);
    }, false);
    createListBox(container, "guide[0].label.align", ['left', 'center', 'right'], function (e) {
        config.yAxis.guides[0].label.align = _getValue(e);
        chart.load(config);
    }, 'left');
    createListBox(container, "guide[0].label.offsetX", ['0', '3', '10', '-3', '-10'], function (e) {
        config.yAxis.guides[0].label.offsetX = _getValue(e);
        chart.load(config);
    }, '3');
    createListBox(container, "guide[0].label.verticalAlign", ['top', 'middle', 'bottom'], function (e) {
        config.yAxis.guides[0].label.verticalAlign = _getValue(e);
        chart.load(config);
    }, 'top');
    createListBox(container, "guide[0].label.offsetY", ['0', '3', '10', '-3', '-10'], function (e) {
        config.yAxis.guides[0].label.offsetY = _getValue(e);
        chart.load(config);
    }, '3');
    line(container);
    createCheckBox(container, 'guide[1].front', function (e) {
        config.yAxis.guides[1].front = _getChecked(e);
        chart.load(config);
    }, true);
    createListBox(container, "guide[1].label.align", ['left', 'center', 'right'], function (e) {
        config.yAxis.guides[1].label.align = _getValue(e);
        chart.load(config);
    }, 'right');
    createListBox(container, "guide[1].label.offsetX", ['0', '3', '10', '-3', '-10'], function (e) {
        config.yAxis.guides[1].label.offsetX = _getValue(e);
        chart.load(config);
    }, '3');
    createListBox(container, "guide[1].label.verticalAlign", ['top', 'middle', 'bottom'], function (e) {
        config.yAxis.guides[1].label.verticalAlign = _getValue(e);
        chart.load(config);
    }, 'top');
    createListBox(container, "guide[1].label.offsetY", ['0', '3', '10', '-3', '-10'], function (e) {
        config.yAxis.guides[1].label.offsetY = _getValue(e);
        chart.load(config);
    }, '3');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
