// https://www.nytimes.com/2023/09/05/upshot/biden-trump-black-hispanic-voters.html
const x = [2020, 2023].map(v => `'${v}`);
const appendX = (data) => {
    return Object.fromEntries(Object.entries(data).map(([key, values]) => {
        // return { [key]: [x[i], values[i]] }
        return [key, values.map((v, i) => [x[i], v])];
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

const xAxis = {
    type: 'category',
    line: false,
    tick: true,
    padding: 0.4,
    // marginNear: 10,
    // marginFar: 10,
};

const yAxis = {
    // strictMin: 50,
    // strictMax: 100,
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
}

const paneBody = {
    style: {
        fill: '#EFEEE5',
    },
};

const subtitles = [
    'is too old',
    'does not have the mental sharpness',
    'does not have the temperament',
]

const cols = 3;
const config = {
    type: 'line',
    title: false,
    // title: 'Democratic share of major party vote among nonwhite voters',
    split: {
        visible: true,
        rows: 1,
        cols,
        panes: Array(cols).fill(paneBody).map((m, i) => { 
            return { 
                body: {
                    ...m,
                    annotations: {
                        text: subtitles[i],
                        offsetY: -30,
                        align: 'left',
                        style: {
                            fill: '#000',
                            fontSize: '10pt',
                            fontWeight: 'bold'
                        }
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
    xAxis: Array(cols).fill(xAxis).map((ax, i) => { return { ...ax, col: i } }),
    yAxis,
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
