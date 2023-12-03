// https://www.nytimes.com/2023/09/05/upshot/biden-trump-black-hispanic-voters.html
const x = [12, 16, 20, 24].map(v => `'${v}`);
const appendX = (data) => {
    return Object.fromEntries(Object.entries(data).map(([key, values]) => {
        // return { [key]: [x[i], values[i]] }
        return [key, values.map((v, i) => [x[i], v])];
    }));
}

const raceData = appendX({
    Black: [96, 95, 91, 89],
    "All nonwhite": [82, 80, 73, 68],
    Hispanic: [70, 69, 64, 59],
    Other: [65, 66, 58, 56],
});

const genderData = appendX({
    Female: [85, 85, 78, 73],
    Male: [78, 74, 67, 62],
});

const ageData = appendX({
    "Age 45+": [83, 81, 75, 68],
    "Age 18 to 44": [81, 79, 71, 70],
});

const educationData = appendX({
    "College deg.": [80, 80, 75, 74],
    "No college deg.": [82, 81, 72, 66],
});

const incomeData = appendX({
    "Less than $50k": [88, 87, 78, 71],
    "$50k to $100k": [79, 78, 71, 62],
    "$100k+": [71, 73, 69, 70],
});

const primary = 'var(--color-1)';
const lineSeries = (m, i) => {
    const [key, values] = m;
    return {
        name: key,
        marker: {
            shape: 'circle',
            radius: 5,
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

const raceSeries = makeSeries(raceData);
const genderSeries = makeSeries(genderData);
const ageSeries = makeSeries(ageData);
const eduSeries = makeSeries(educationData);
const incomeSeries = makeSeries(incomeData);

const xAxis = {
    type: 'category',
    line: false,
    tick: true,
    padding: 0.4,
    // marginNear: 10,
    // marginFar: 10,
};

const yAxis = {
    strictMin: 50,
    strictMax: 100,
    // step: 10,
    tick: {
        // gap: 10,
        stepInterval: 10,
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
    'By race',
    'Gender',
    'Age',
    'Education',
    'Income',
]

const config = {
    type: 'line',
    title: false,
    // title: 'Democratic share of major party vote among nonwhite voters',
    split: {
        visible: true,
        rows: 1,
        cols: 5,
        panes: Array(5).fill(paneBody).map((m, i) => { 
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
    xAxis: Array(5).fill(xAxis).map((ax, i) => { return { ...ax, col: i } }),
    yAxis,
    body: {
        style: {

            backgroundColor: '#EFEEE5',
        }
    },
    series: [{
            name: 'Races',
            xAxis: 0,
            children: raceSeries,
            style: {
                backgroundColor: '#112233'
            }
        }, {
            name: 'Gender',
            xAxis: 1,
            children: genderSeries,
        }, {
            name: 'Age',
            xAxis: 2,
            children: ageSeries
        }, {
            name: 'Education',
            xAxis: 3,
            children: eduSeries,
        }, {
            name: 'Income',
            xAxis: 4,
            children: incomeSeries
        }
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
