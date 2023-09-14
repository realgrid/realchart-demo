/**
 * @demo
 * 
 */
const config = {
    title: "Funnel Series",
    options: {
        animatable: false
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
    createCheckBox(container, 'Reversed', function (e) {
        config.series.reversed = _getChecked(e);
        chart.update(config, animate);
    }, false);
    createListBox(container, "Legend.position", ['bottom', 'top', 'right', 'left'], function (e) {
        config.legend.position = _getValue(e);
        chart.update(config, animate);
    }, 'right');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
