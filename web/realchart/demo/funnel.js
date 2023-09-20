/**
 * @demo
 * 
 */
const config = {
    title: "Funnel Series",
    options: {
        // animatable: false
    },
    legend: {
        position: 'right',
        // layout: 'vertical',
        style: {
            marginTop: '16px',
            marginRight: '20px'
        }
    },
    xAxis: {
    },
    yAxis: {
    },
    series: {
        type: 'funnel',
        // reversed: true,
        // neckWidth: 0,
        // neckHeight: 0,
        pointLabel: {
            visible: true,
            text: "${name} (${y})",
            // effect: 'outline'
        },
        legendByPoint: true,
        data: [ 
            { name: 'moon', y: 53, sliced: true }, 
            { name: 'yeon', y: 97, color: '#0088ff' }, 
            { name: 'lim', y: 17}, 
            { name: 'moon', y: 9}, 
            { name: 'hong', y: 13 }, 
            { name: 'america', y: 23}, 
            { name: 'asia', y: 29}
        ],
    }
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
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
    createListBox(container, "Legend.position", ['bottom', 'top', 'right', 'left'], function (e) {
        config.legend.position = _getValue(e);
        chart.load(config, animate);
    }, 'right');
    line(container);
    createCheckBox(container, 'series.reversed', function (e) {
        config.series.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createListBox(container, "series.width", ['75%', '85%', '90%', '100%'], function (e) {
        config.series.width = _getValue(e);
        chart.load(config, animate);
    }, '85%');
    createListBox(container, "series.height", ['85%', '90%', '95%', '100%'], function (e) {
        config.series.height = _getValue(e);
        chart.load(config, animate);
    }, '90%');
    createListBox(container, "series.neckWidth", ['25%', '30%', '35%', '100%'], function (e) {
        config.series.neckWidth = _getValue(e);
        chart.load(config, animate);
    }, '85%');
    createListBox(container, "series.neckHeight", ['25%', '30%', '35%', '100%'], function (e) {
        config.series.neckHeight = _getValue(e);
        chart.load(config, animate);
    }, '90%');
    line(container);
    createListBox(container, "series.centerX", ['40%', '45%', '50%', '55%', '60%'], function (e) {
        config.series.centerX = _getValue(e);
        chart.load(config, animate);
    }, '50%');
    createListBox(container, "series.centerY", ['40%', '45%', '50%', '55%', '60%'], function (e) {
        config.series.centerY = _getValue(e);
        chart.load(config, animate);
    }, '50%');
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
