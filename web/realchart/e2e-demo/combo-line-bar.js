/**
 * @demo
 * 
 * Bar Series 기본 예제.
 */
const config = {
    options: {
        // animatable: false
    },
    title: "Line & Bar Series",
    xAxis: {
        title: "일일 Daily fat",
        categories: ['쓰리엠', '아디다스', 'Youtube', '디즈니', '이마트', '메리어트', '시세이도'],
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
        // reversed: true,
        // baseValue: -1
    },
    legend: true,
    series: [{
        type: 'bar',
        pointLabel: true,
        // marker: false,
        data: [11, 13, 10, 15, 19, 22, 27]
    }, {
        type: 'area',
        data: [9, 11, 10, 15, 19, 22, 27],
        style: {
            fill: 'black',
        },
        marker: {
            radius: 5,
            style: {
                stroke: 'white',
                strokeWidth: '2px'
            }
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
