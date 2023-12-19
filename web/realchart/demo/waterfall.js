/**
 * @demo
 * 
 */
const config = {
    options: {
        // animatable: false
    },
    title: "Waterfall Series",
    xAxis: {
        title: "일일 Daily fat",
        grid: true,
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
    },
    series: {
        type: 'waterfall',
        tooltipText: 'low: ${low}<br>save: ${save}',
        pointLabel: {
            visible: true,
            position: 'inside',
            effect: 'outline'
        },
        data: [{
            name: 'Start',
            y: 120000
        }, {
            name: 'Product Revenue',
            y: 569000
        }, {
            name: 'Service Revenue',
            y: 231000
        }, {
            name: 'Positive Balance',
            isSum: true,
        }, {
            name: 'Fixed Costs',
            y: -342000
        }, {
            name: 'Variable Costs',
            y: -233000
        // }, {
        //     name: 'Positive Balance2',
        //     isSum: true,
        }, {
            name: 'Balance',
            isSum: true,
        }]
    }
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createCheckBox(
        container,
        "Always Animate",
        function (e) {
            animate = _getChecked(e);
        },
        false
    );
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
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
    createListBox(container, "cornerRadius", [0, 3, 6, 10, 100], function (e) {
        config.series.cornerRadius = +_getValue(e);
        chart.load(config, animate);
    }, '0');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
