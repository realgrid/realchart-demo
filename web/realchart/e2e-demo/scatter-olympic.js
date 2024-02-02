/**
 * @demo
 */

const tool = {
    actions: [{ type: 'config.polar' }],
};
const config = {
    polar: true,
    type: 'scatter',
    templates: {
        series: {
            xField: 'height',
            yField: 'weight',
            radius: 5,
        },
    },
    options: {},
    title: {
        text: "Olympic player's physique",
        align: 'left',
    },
    xAxis: {
        title: 'Height',
        baseValue: null,
    },
    yAxis: {
        // strictMin: 0,
        line: {
            visible: true,
            // style: {
            //     stroke: 'blue'
            // }
        },
        title: 'Weight',
    },
    series: [
        {
            template: 'series',
            name: 'Asia',
            data: data
                .filter((r) => r.continent == 'Asia')
                .slice(0, 200)
                .filter((v) => v.height > 0 && v.weight > 0),
            // pointLabel: true
        },
        {
            template: 'series',
            name: 'Europe',
            data: data
                .filter((r) => r.continent == 'Europe')
                .slice(0, 200)
                .filter((v) => v.height > 0 && v.weight > 0),
            shape: 'diamond',
            color: 'var(--color-3)',
        },
    ],
};

let chart;

function setActions(container) {
    createCheckBox(
        container,
        'Debug',
        function (e) {
            RealChart.setDebugging(_getChecked(e));
            chart.render();
        },
        false
    );
    createButton(container, 'Test', function (e) {
        alert('hello');
    });
    createCheckBox(
        container,
        'Inverted',
        function (e) {
            config.inverted = _getChecked(e);
            chart.load(config);
        },
        false
    );
    createCheckBox(
        container,
        'X Reversed',
        function (e) {
            config.xAxis.reversed = _getChecked(e);
            chart.load(config);
        },
        false
    );
    createCheckBox(
        container,
        'Y Reversed',
        function (e) {
            config.yAxis.reversed = _getChecked(e);
            chart.load(config);
        },
        false
    );
    createCheckBox(
        container,
        'Polar',
        function (e) {
            config.polar = _getChecked(e);
            chart.load(config);
        },
        false
    );
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
