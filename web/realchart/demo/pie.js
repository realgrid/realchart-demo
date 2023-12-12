/**
 * @demo
 * 
 */
const config = {
    title: "Pie Series",
    options: {
        // animatable: false,
    },
    legend: {
        position: 'right',
        // layout: 'auto',
        style: {
            marginRight: '20px'
        }
    },
    plot: {
        // style: { fill: 'yellow' }
    },
    series: {
        type: 'pie',
        legendByPoint: true,
        pointLabel: {
            visible: true,
            // position: 'outside',
            text: "${name} (${y})",
            // effect: 'outline',
            style: {
                // fill: '#eee'
            }
        },
        data: [ 
            { name: 'moon', y: 53, sliced: true }, 
            { name: 'yeon', y: 97 },// color: '#0088ff' }, 
            { name: 'lim', y: 17}, 
            { name: 'moon', y: 9}, 
            { name: 'hong', y: 13 }, 
            { name: 'america', y: 23}, 
            { name: 'asia', y: 29}, 
            // 23,
            // 7,
            // 17,
            // 13
        ],
    }
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
    createListBox(container, "options.palette", ['default', 'warm', 'cool', 'forest', 'gray'], function (e) {
        config.options.palette = _getValue(e);
        chart.load(config, animate);
    }, 'default');
    createCheckBox(container, 'Legend', function (e) {
        config.legend.visible = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createListBox(container, "Legend.location", ['bottom', 'top', 'right', 'left'], function (e) {
        config.legend.location = _getValue(e);
        chart.load(config, animate);
    }, 'bottom');
    line(container);
    createListBox(container, "series.startAngle", [0, 90, 180, 270], function (e) {
        config.series.startAngle = _getValue(e);
        chart.load(config, animate);
    }, 0);
    createListBox(container, "series.totalAngle", [360, 270, 225, 180], function (e) {
        config.series.totalAngle = _getValue(e);
        chart.load(config, animate);
    }, 360);
    createCheckBox(container, 'series.clockwise', function (e) {
        config.series.clockwise = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createListBox(container, "series.radius", ['30%', '35%', '40%', '45%'], function (e) {
        config.series.radius = _getValue(e);
        chart.load(config, animate);
    }, '40%');
    createListBox(container, "series.centerX", ['30%', '40%', '50%', '60%'], function (e) {
        config.series.centerX = _getValue(e);
        chart.load(config, animate);
    }, '50%');
    createListBox(container, "series.centerY", ['45%', '50%', '55%'], function (e) {
        config.series.centerY = _getValue(e);
        chart.load(config, animate);
    }, '50%');
    line(container);
    createListBox(container, "series.pointLabel.position", ['auto', 'outside'], function (e) {
        config.series.pointLabel.position = _getValue(e);
        chart.load(config, animate);
    }, 'auto');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
