/**
 * @demo
 * 
 * Building Space
 * https://www.nytimes.com/interactive/2023/07/21/nyregion/nyc-developers-private-owned-public-spaces.html
 */

const yAxis = {
    grid: false,
    label: false,
    strictMax: 520000
}

const pointLabel = {
    visible: true,
    // position: 'inside',
    position: 'auto',
    // numberFormat: '#'
    style: {
        fontSize: '6pt',
    }
};

const config = {
    templates: {
    },
    inverted: true,
    title: "Building Space",
    options: {
        // animatable: false
    },
    legend: {
        visible: false,
        itemGap: 100,
        backgroundStyle: {
            fill: 'none'
        }
    },
    split: {
        visible: true,
        rows: 2
    },
    xAxis: [{
        type: 'category',
        label: {
            visible: true,
            step: 1,
        },
        reversed: true,
        line: false,
        grid: !false,
    }],
    yAxis: [{
        reversed: true,
        ...yAxis
    }, {
        row: 1,
        ...yAxis
    }],
    series: [{
        name: 'Public',
        pointLabel,
        yField: 'Public',
        xField: 'Building',
        style: {
            fill: '#333',
            stroke: '#333'
        },
        data,
    }, {
        name: 'Bonus Floor',
        color: '#ffaa00',
        yAxis: 1,
        pointLabel,
        yField: 'Bonus Floor',
        xField: 'Building',
        style: {
            fill: 'var(--color-1)',
            stroke: 'var(--color-1)',
        },
        data,
    }]
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
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis[0].reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis[0].reversed = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createCheckBox(container, 'Y Reversed2', function (e) {
        config.yAxis[1].reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
