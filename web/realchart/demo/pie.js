/**
 * @demo
 * 
 */
const config = {
    title: "Pie Series",
    options: {
    },
    legend: {
        position: 'right',
        layout: 'auto',
        style: {
            marginRight: '20px'
        }
    },
    xAxis: {
    },
    yAxis: {
    },
    series: {
        type: 'pie',
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
        chart.refresh();
    }, false);
    createCheckBox(container, 'Always Animate', function (e) {
        animate = _getChecked(e);
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createListBox(container, "options.palette", ['default', 'warm', 'cool', 'forest', 'gray'], function (e) {
        config.options.palette = _getValue(e);
        chart.update(config, animate);
    }, 'default');
    createListBox(container, "Legend.position", ['bottom', 'top', 'right', 'left'], function (e) {
        config.legend.position = _getValue(e);
        chart.update(config, animate);
    }, 'right');
    createListBox(container, "startAngle", [0, 90, 180, 270], function (e) {
        config.series.startAngle = _getValue(e);
        chart.update(config, animate);
    }, 0);
    createListBox(container, "series.pointLabel.position", ['auto', 'outside'], function (e) {
        config.series.pointLabel.position = _getValue(e);
        chart.update(config, animate);
    }, 'auto');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
