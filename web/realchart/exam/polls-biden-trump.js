// https://www.nytimes.com/2023/09/05/upshot/biden-trump-black-hispanic-voters.html
const x = [2020, 2023];
const appendX = (data) => {
    return Object.fromEntries(Object.entries(data).map(([key, values]) => {
        return [key, values.map((v, i) => [x[i].toString(), v])];
    }));
}

const poll1Data = appendX({
    Biden: [34, 71],
    Trump: [18, 39],
});

const poll2Data = appendX({
    Biden: [45, 62],
    Trump: [48, 44],
});

const poll3Data = appendX({
    Biden: [39, 51],
    Trump: [58, 55],
});

const primary = 'var(--color-1)';
const lineSeries = (m, i) => {
    const [key, values] = m;
    return {
        name: key,
        marker: {
            shape: 'circle',
            radius: 0,
            style: {
                stroke: '#fff',
            }
        },
        pointLabel: {
            text: key,
            visibleCallback: ({vindex}) => {
                // even i, vi 0
                // odd i, vi last.
                const even = i % 2 == 0;
                return even ? vindex == 0 : vindex == (values.length - 1);
            },
            position: 'foot',
            style: {
                fontSize: '10pt',
                fontWeight: 500,
            }
        },
        data: values,
        style: {
            fill: primary,
            stroke: primary,
            strokeWidth: 2,
        }
    };
}

const makeSeries = (data) => {
    return Object.entries(data).map((m, i) => {
        return lineSeries(m, i);
    })
}

const poll1Series = makeSeries(poll1Data);
const poll2Series = makeSeries(poll2Data);
const poll3Series = makeSeries(poll3Data);

console.debug(poll1Series)

const subtitles = [
    'is too old',
    'does not have the mental sharpness',
    'does not have the temperament',
]

const cols = 3;
const config = {
    type: 'line',
    templates: {
        xAxis: {
            type: 'category',
            line: false,
            tick: true,
            label: true,
            padding: 0.2,
        },
        yAxis: {
            // step: 10,
            tick: {
                gap: 10,
            },
            label: {
                suffix: '%'
            },
            grid: {
                style: {
                    stroke: '#fff'
                }
            }
        },
        paneBody: {
            body: {
                style: {
                    fill: '#EFEEE5',
                },
                annotations: {
                    offsetY: -30,
                    align: 'left',
                    style: {
                        fill: '#000',
                        fontSize: '10pt',
                        fontWeight: 'bold'
                    }
                }
            }
        }
    },
    title: {
        text: 'Democratic share of major party vote among nonwhite voters',
        align: 'left',
    },
    subtitle: {
        text: '<t></t>',
        gap: 30,
    },
    split: {
        visible: true,
        cols,
        panes: Array(cols).fill().map((_, i) => { 
            return { 
                template: 'paneBody',
                body: {
                    annotations: {
                        text: subtitles[i]
                    }
                },
                col: i, 
            };
        })
    },
    options: {
        style: {
            // backgroundColor: '#EFEEE5'
        },
        credits: false,
    },
    legend: false,
    xAxis: Array(cols).fill().map((_, i) => { 
        return { 
            template: 'xAxis', 
            col: i } 
        }),
    yAxis: {
        template: 'yAxis'
    },
    body: {
        style: {
            backgroundColor: '#EFEEE5',
        }
    },
    series: [{
            xAxis: 0,
            children: poll1Series,
        }, {
            xAxis: 1,
            children: poll2Series,
        }, {
            xAxis: 2,
            children: poll3Series
        }, 
    ],
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
