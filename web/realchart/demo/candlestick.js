/**
 * @demo
 * 
 */

const stockData = data.sort((a, b) => a.date > b.date).filter(r => r.date >= '2021-05-01')
const config = {
    actions: [
        {
            type: 'check',
            label: 'Use StyleCallback',
            action: ({value}) => {
                config.series.template = value ? 'series' : '';
                chart.load(config);
            }
        }
    ],
    title: {
        text: 'WTI (Woori Tech Inc.)',
        align: 'left',
        style: {
            fill: '#666',
            fontWeight: 700,
        }
    },
    templates: {
        series: {
          pointStyleCallback: (args) => {
            const {index, open, close, series} = args;
            if (!index) {
                return { fill: 'none', stroke: "#000" };
            } else if (index && close > series.get('data')[index-1].closeprc) {
                if (close > open) {
                    return { fill: "var(--color-5)", stroke: "#000" };
                } else {
                    return { fill: "var(--color-3)", stroke: "#000" };
                }
            } else {
                if (close > open) {
                    return { fill: "var(--color-7)", stroke: "#000" };
                } else {
                    return { fill: "var(--color-1)", stroke: "#000" };
                }
            }
          },
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
    annotations: [
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
            // textCallback: ({value}) => {
            //     const d = new Date(value);
            //     return d.toLocaleDateString('en-us', { day: 'numeric', month: 'short', year: 'numeric' });
            // }
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
        template: '',
        // tooltipText: '<b>종가: ${close}</b>',
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
        declineStyle: {
            fill: 'var(--color-3)'
        },
		style: {
			fill: 'var(--color-1)',
			stroke: 'black'
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
    createButton(container, 'Add Point', function (e) {
        chart.series.addPoint({
            "date":"2021-06-03","openprc":80300,"highprc":80600,"lowprc":79600,"closeprc":80500,
            "trdamnt":13321324},{"date":"2021-06-01","openprc":80500,"highprc":81300,"lowprc":80100,
            "closeprc":80600,"trdamnt":14058401},{"date":"2021-06-02","openprc":80400,"highprc":81400,
            "lowprc":80300,"closeprc":80800,"trdamnt":16414644});
    });
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
