/**
 * @demo
 * 
 * Bar Series 기본 예제.
 */
const config = {
    templates: {
        series: {
            data: [11, 13, 10, 15, 19, 22]
        }
    },
    title: "Line & Lollipop Series",
    options: {
        // animatable: false
    },
    xAxis: {
        title: "일일 Daily fat",
        categories: ['`14', '`15', '`16', '`17', '`18', '`19'],
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
        // reversed: true,
        // baseValue: -1
    },
    legend: true,
    series: [{
        template: 'series',
        type: 'line',
        pointLabel: true,
    }, {
        template: 'series',
        type: 'lollipop',
        visibleInLegend: false,
        style: {
            fill: 'none',
            strokeWidth: '1px',
        }
    }]
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        console.log(chart.model);
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
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
