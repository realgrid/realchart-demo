const config = {
    type: "line",
    options: {},
    title: {
        text: "Bump Chart",
        style: {
            marginBottom: '30px'
        },
    },
    xAxis: {
        title: "일일 Daily fat",
        type: 'category'
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
        tick: {
            steps: [0, 1, 2]
        }
    },
    series: {
        type: 'bump',
        series: [{
            name: 'Installation & Developers',
            pointLabel: true,
            data: [43, 48, 65, 27, 43, 83,
                33, 74, 57, 54, 10]
        }, {
            name: 'Manufacturing',
            pointLabel: true,
            data: [24, 37, 42, 51, 90, 82,
                21, 85, 26, 43, 50]
        }, {
            name: 'Other',
            pointLabel: true,
            data: [21, 48, 81, 48, 89, 16, 
                74, 17, 53, 11, 73]
        }],
    }
}

let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.update(config);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
