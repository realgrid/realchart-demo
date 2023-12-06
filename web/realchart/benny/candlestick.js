/**
 * @demo
 * 
 */

const stockData = data.sort((a, b) => a.date > b.date).filter(r => r.date >= '2021-04-01')
const config = {
    title: {
        text: 'WTI (Woori Tech Inc.)',
        align: 'left',
        style: {
            fill: '#666',
            fontWeight: 700,
        }
    },
    options: {
        credits: false,
    },
    body: {
        style: {
            // fill: '#F7F5F5'
        }
    },
    annotation: [
        {
            offsetX: 280,
            offsetY: 3,
            text: '81,400',
            style: {
                fontSize: '16pt',
                fontWeight: 700,
                fill: '#000'
            }
        },
        {
            offsetX: 355,
            offsetY: 8,
            text: '-1,200 (-0.01%)',
            style: {
                fontSize: '12pt',
                fontWeight: 700,
                fill: 'var(--color-3)'
            }
        }
    ],
    legend: !true,
    xAxis: {
        type: 'time',
        tick: {
            visible: !true,
            stepInterval: '1w',
        },
        label: {
            visible: true,
            // step: 10,
            // timeFormat: 'M, yyyy',
            textCallback: ({value}) => {
                const d = new Date(value);
                return d.toLocaleDateString('en-us', { day: 'numeric', month: 'short', year: 'numeric' });
            }
        }
    },
    yAxis: {
        crosshair: true,
        tick: {
            stepInterval: 1000,
        }
        // position: 'opposite'
    },
    series: {
        // pointStyleCallback: args => {return { fill: 'red', stroke: 'red'}},
        pointStyleCallback: (args) => {
            console.debug(args)
            if (args.index > 0 && args.y > stockData[args.index - 1].highprc) {
                return { fill: "var(--color-3)", stroke: "#000" };
            } else {
                return { fill: "var(--color-1)", stroke: "#000" };
            }
        },
        padding: 1,
        pointPadding: 0.1,
        type: 'candlestick',
        pointLabel: !true,
        xField: 'date',
        openField: 'openprc',
        highField: 'highprc',
        lowField: 'lowprc',
        closeField: 'closeprc',
        data: stockData,
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
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
