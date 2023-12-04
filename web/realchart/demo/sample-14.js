const config = {
    options: {
        // animatable: false
    },
    title: 'Gapminder Global Indicators',
    xAxis: {
        title: 'xAxis'
    },
    yAxis: {
        title: 'yAxis'
    },
    series: [{
        type: 'bubble',
        pointLabel: {
            // visible: true,
            suffix: 'm',
            effect: 'outline',
            // position: 'outside'
        },
        tooltip: {
            text: 'x: ${x}<br>y: ${y}<br>z: ${z}'
        },
        sizeMode: 'width',
        shape: 'rectangle',
        radius: 0.1,
        data: {}
    }]
};

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
    createCheckBox(container, 'series.alternate', function (e) {
        config.series.alternate = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'series.groupMode', function (e) {
        config.series.groupMode = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createListBox(container, "series.startDir", ['vertical', 'horizontal'], function (e) {
        config.series.startDir = _getValue(e);
        chart.load(config, animate);
    }, 'vertical');
    createListBox(container, "series.algorithm", [1952, 1957, 1962, 1967, 1972, 1977, 1982, 1987, 1992, 1997], function (e) {
        config.series.algorithm = _getValue(e);
        chart.load(config, animate);
    }, 'squarify');
}

const createData = (year) => {
    let result = [];
    const continents = [...new Set(bubble.map((value) => value.continent))];

    const data = bubble.filter((value) => value.year === year);

    continents.forEach((continent, index) => {
        result.push({
            name: continent,
            type: 'bubble',
            // pointLabel: {
            //     visible: true,
            //     suffix: 'm',
            //     effect: 'outline',
            //     position: 'outside'
            // },
            tooltip: {
                text: 'x: ${x}<br>y: ${y}<br>z: ${z}'
            },
            sizeMode: 'width',
            shape: 'rectangle',
            radius: 0.1,
            data: data.filter((value) => value.continent === continent).map((value) => {
                return [value.gdpPercap, value.lifeExp, value.pop]; 
            })
        });
    });


    return result;
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    config.series = createData(1952);
    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
