/**
 * @demo
 * 
 */
const config = {
    title: "Donut Series",
    options: {
    },
    legend: {
        position: 'inside',
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
        innerSize: '50%',
        //innerText: 'Inner Title',
        innerText: '내부 타이틀<br><t style="fill:blue;font-weight:bold;">Inner</t><t style="fill:red;">Title</t>',
        pointLabel: {
            visible: true,
            effect: 'outline',
            style: {
                // fill: '#eee'
            }
        },
        data: [ 
            { name: 'moon', y: 53 }, 
            { name: 'yeon', y: 97, color: '#0088ff' }, 
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
    createCheckBox(container, 'Legend', function (e) {
        config.legend.visible = _getChecked(e);
        chart.update(config, animate);
    }, true);
    createListBox(container, "Legend.position", ['bottom', 'top', 'right', 'left'], function (e) {
        config.legend.position = _getValue(e);
        chart.update(config, animate);
    }, 'left');
    line(container);
    createListBox(container, "startAngle", [0, 90, 180, 270], function (e) {
        config.series.startAngle = _getValue(e);
        chart.update(config, animate);
    }, 0);
    createListBox(container, "series.size", ['60%', '70%', '80%', '90%', '100%'], function (e) {
        config.series.size = _getValue(e);
        chart.update(config, animate);
    }, '80%');
    createListBox(container, "series.centerX", ['30%', '40%', '50%', '60%'], function (e) {
        config.series.centerX = _getValue(e);
        chart.update(config, animate);
    }, '50%');
    createListBox(container, "series.centerY", ['45%', '50%', '55%'], function (e) {
        config.series.centerY = _getValue(e);
        chart.update(config, animate);
    }, '50%');
    line(container);
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
