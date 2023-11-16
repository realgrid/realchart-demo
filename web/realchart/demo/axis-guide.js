/**
 * @demo
 * 
 * 축의 특정한 위치나 범위를 강조해서 표시하는 방법.
 */
const config = {
    options: {
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
            value: 12,
            label: {
                text: 'line guide',
                style: {
                    fill: 'blue'
                }
            },
            style: {
                stroke: 'blue',
                strokeDasharray: '4'
            }
        }, {
            type: 'range',
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
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'inverted', function (e) {
        RealChart.setDebugging(_getChecked(e));
        config.inverted = _getChecked(e);
        chart.load(config);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
