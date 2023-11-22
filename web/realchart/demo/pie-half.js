/**
 * @demo
 * 
 */
const config = {
    title: {
        text: 'Number of Mobile Users in the World (Users In Millions)',
        alignBase: 'chart'
    },
    options: {
        animatable: false,
    },
    legend: {
        location: 'right',
    },
    series: {
        type: 'pie',
        totalAngle: 180,
        startAngle: 270,
        legendByPoint: true,
        radius: '60%',
        centerY: '80%',
        pointLabel: {
            visible: true,
            text: '${y}',
            style: {
            }
        },
        data: [ 
            { name: 'Lava', y: 50, color: '#002F5C'}, 
            { name: 'HP', y: 48, color: '#004987'},
            { name: 'Moto', y: 55, color: '#004F92'}, 
            { name: 'Sony', y: 45, color: '#00569D'}, 
            { name: 'LG', y: 48, color: '#3E77B6'}, 
            { name: 'Samsung', y: 50, color: '#90B1D8'}, 
            { name: 'Redmi', y: 53, color: '#BBD2Ec'}, 
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
    createCheckBox(container, 'Legend', function (e) {
        config.legend.visible = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createListBox(container, "Legend.location", ['bottom', 'top', 'right', 'left'], function (e) {
        config.legend.location = _getValue(e);
        chart.load(config, animate);
    }, 'right');
    line(container);
    createListBox(container, "series.startAngle", [0, 90, 180, 270], function (e) {
        config.series.startAngle = _getValue(e);
        chart.load(config, animate);
    }, 270);
    createListBox(container, "series.totalAngle", [360, 270, 225, 180], function (e) {
        config.series.totalAngle = _getValue(e);
        chart.load(config, animate);
    }, 180);
    createCheckBox(container, 'series.clockwise', function (e) {
        config.series.clockwise = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createListBox(container, "series.radius", ['30%', '35%', '40%', '60%'], function (e) {
        config.series.radius = _getValue(e);
        chart.load(config, animate);
    }, '60%');
    createListBox(container, "series.centerX", ['30%', '40%', '50%', '60%'], function (e) {
        config.series.centerX = _getValue(e);
        chart.load(config, animate);
    }, '50%');
    createListBox(container, "series.centerY", ['45%', '50%', '80%'], function (e) {
        config.series.centerY = _getValue(e);
        chart.load(config, animate);
    }, '80%');
    line(container);
    createListBox(container, "series.pointLabel.position", ['auto', 'outside'], function (e) {
        config.series.pointLabel.position = _getValue(e);
        chart.load(config, animate);
    }, 'auto');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
