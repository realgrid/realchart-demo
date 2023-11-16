/**
 * @demo
 * 
 */
const config = {
    templates: {
        series: {
            pointPadding: 0.05,
            pointLabel: {
                visible: true,
                effect: 'outline',
                outlineThickness: 3,
                numberFormat: ',#.00',
                style: {
                    fontSize: '18px',
                    fontWeight: 'bold'
                },
                styleCallback: p => p.yValue >= 2 ? { fill: 'red' } : void 0
            }
        }
    },
    title: {
        text: "7개 카드사 연체율 추이",
        align: 'left',
        style: {
            fontSize: '32px',
            fontWeight: 'bold',
            fill: '#333'
        }
    },
    subtitle: {
        text: '(단위: %)',
        positiion: 'right',
        verticalAlign: 'bottom',
        style: {
            fontSize: '20px'
        }
    },
    xAxis: {
        categories: ['신한', '삼성', 'KB', '롯데', 'BC', '우리', '하나'],
        tick: 2,
        label: {
            style:  {
                fontSize: '20px',
                fontWeight: 'bold',
                fill: '#555'
            }
        }
    },
    yAxis: {
        visible: false,
        guide: {
            type: 'line',
            value: 2,
            label: {
                text: '2.0',
                style: {
                    fontSize: '18px'
                }
            },
            style: {
                stroke: 'red',
            }
        }
    },
    series: [{
        name: 'prev',
        template: 'series',
        label: '2023년 6월말',
        data: [
            1.73, 1.19, 1.92, 1.36, 1.54, 1.82, 1.86
        ],
        color: '#6daeb7'
    }, {
        name: 'curr',
        template: 'series',
        label: '2023년 9월말',
        data: [
            1.62, 1.15, 2.02, 1.58, 1.05, 2.10, 2.25
        ],
        color: '#117784'
    }],
    legend: {
        location: 'body',
        markerSize: 14,
        style: {
            fontSize: '20px',
            fontWeight: 'bold',
            fill: '#555'
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
