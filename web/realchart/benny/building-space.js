/**
 * @demo
 * 
 * Building Space
 * https://www.nytimes.com/interactive/2023/07/21/nyregion/nyc-developers-private-owned-public-spaces.html
 */

const space = (n) => {
    return Array(n).fill('&nbsp;').join('');
}

// 보여주기용 데이터 모양 변경. 데이터 의미 없음.
const len = 12;
const buildingData = data.filter((_, i) => i < len).map((r, i, rows) => {
    console.log({rows})
    r["Public"] = rows[i]["Bonus Floor"] * 0.9;
    return r;
})

const config = {
    templates: {
        yAxis: {
            grid: false,
            label: false,
            strictMax: 520000
        },
        series: {
            pointLabel: {
                visible: true,
                position: 'auto',
                style: {
                    fontSize: '9pt',
                }
            }
            
        },
        annotation: {
            style: {
                fontSize: '10pt',
                fontWeight: 600,
                fontFamily: 'monospace',
            }
        }
    },
    inverted: true,
    title: {
        text: 'Building Space',
        gap: 50,
    },
    options: {
        // animatable: false
    },
    legend: {
        visible: false,
        // gap: -100,
        // offsetY: -100,
    },
    split: {
        visible: true,
        rows: 2,
        panes: [
            {
                body: {
                    annotations: [
                        // {
                        //     template: 'annotation',
                        //     offsetX: 280,
                        //     offsetY: -40,
                        //     text: 'Public<br>Space',
                        //     style: {
                        //         textAlign: 'right'
                        //     }
                        // },
                    ]
                }
            }, 
            {
                row: 1,
                body: {
                    annotations: [
                        // {
                        //     template: 'annotation',
                        //     offsetX: 20,
                        //     offsetY: -40,
                        //     text: 'Bonus Floor<br>Space',
                        //     style: {
                        //         textAlign: 'left'
                        //     }
                        // },
                    ]
                },
            }
        ]
    },
    xAxis: [{
        type: 'category',
        tick: {
            // gap: -100,
            stepInterval: 1,
        },
        label: {
            visible: !true,
            step: 1,
            style: {
                fill: '#333',
                fontWeight: 500,
                fontFamily: 'monospace'
            },
            rotation: true,
        },
        reversed: true,
        line: false,
        grid: true,
    }],
    yAxis: [{
        template: 'yAxis',
        reversed: true,
    }, {
        template: 'yAxis',
        row: 1,
    }],
    series: [{
        name: 'Public',
        template: 'series',
        pointLabel: {
            style: {
                fill: '#999',
            },
        },
        yField: 'Public',
        xField: 'Building',
        style: {
            fill: '#555',
            stroke: '#555'
        },
        data: buildingData,
    }, {
        name: 'Bonus Floor',
        template: 'series',
        yAxis: 1,
        pointLabel: {
            position: 'inside',
            style: {
                fill: '#fff',
            },
        },
        yField: 'Bonus Floor',
        xField: 'Building',
        style: {
            fill: 'var(--color-8)',
            stroke: 'var(--color-8)',
        },
        data: buildingData,
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
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis[0].reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis[0].reversed = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createCheckBox(container, 'Y Reversed2', function (e) {
        config.yAxis[1].reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
