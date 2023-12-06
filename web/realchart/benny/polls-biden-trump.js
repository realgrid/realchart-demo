// https://www.nytimes.com/2023/11/05/upshot/polls-biden-trump-2024.html
const x = [2020, 2023];
const appendX = (data) => {
    return Object.fromEntries(Object.entries(data).map(([key, values]) => {
        return [key, values.map((v, i) => [x[i].toString(), v])];
    }));
}

const data = [{
    Biden: [34, 71],
    Trump: [18, 39],
}, {
    Biden: [45, 62],
    Trump: [48, 44],
}, {
    Biden: [39, 51],
    Trump: [58, 55],
}];
const pollData = data.map(m => appendX(m));

const primary = 'var(--color-1)';
const secondary = '#bbb';
const lineSeries = (m, i) => {
    const [key, values] = m;
    return {
        template: 'series',
        name: key,
        data: values,
        style: {
            stroke: i % 2 == 0 ? primary : secondary
        }
    };
}

const makeSeries = (data) => {
    return Object.entries(data).map((m, i) => {
        return lineSeries(m, i);
    })
}

const pollSeries = pollData.map(m => makeSeries(m))

const subtitles = [
    'is too old',
    'does not have the mental sharpness',
    'does not have the temperament',
]

const yMax = 80;
const strictMin = 10;
const chartHeight = 340;
const cols = 3;

const avg = (arr) => arr.reduce((prev, next) => prev + next) / arr.length;
const annoLegendOffset = (data, name) => {
    const avgset = {
        Biden: avg(data.Biden),
        Trump: avg(data.Trump)
    }
    const isLower = Math.max(avgset.Biden, avgset.Trump) > avgset[name];
    // if gt than append more
    const padding = 80;
    return (yMax - strictMin - avgset[name]) / (yMax - strictMin) * chartHeight + (isLower ? padding : 0);
}

const config = {
    type: 'line',
    templates: {
        xAxis: {
            line: {
                visible: true,
                style: {
                    strokeWidth: 3
                }
            },
            tick: false,
            label: true,
            padding: -0.25,
            style: {
                fill: '#fff'
            }
        },
        yAxis: {
            grid: false,
            label: false,
            strictMin,
            maxValue: yMax,
        },
        paneBody: {
            body: {
                style: {
                    fill: '#F7F5F5',
                },
            }
        },
        annoSubtitle: {
            offsetY: -30,
            align: 'center',
            style: {
                fill: '#000',
                fontSize: '12pt',
                fontWeight: 'bold'
            }
        },
        annoLegend: {
            offsetX: 180,
            style: {
                fontSize: '14pt',
                fontWeight: 'bold'
            }
        },
        series: {
            marker: false,
            pointLabel: {
                visible: true,
                // position: 'foot',
            },
            style: {
                strokeWidth: 4,
            }
        }
    },
    title: {
        text: 'Share Who Think Each Candidate ...',
        align: 'left',
    },
    subtitle: {
        text: '<t></t>',
        titleGap: 30,
    },
    split: {
        visible: true,
        cols,
        panes: Array(cols).fill().map((_, i) => { 
            return { 
                template: 'paneBody',
                body: {
                    annotations: [{
                        template: 'annoSubtitle',
                        text: subtitles[i]
                    }, {
                        template: 'annoLegend',
                        offsetY: annoLegendOffset(data[i], 'Biden'),
                        text: 'Biden',
                        style: {
                            fill: primary,
                        }
                    }, {
                        template: 'annoLegend',
                        offsetY: annoLegendOffset(data[i], 'Trump'),
                        text: 'Trump',
                        style: {
                            fill: '#aaa',
                        }
                    }]
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
            type: 'category',
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
    series: pollSeries.map((s, i) => {
        return {
            xAxis: i,
            children: s
        }
    })
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
