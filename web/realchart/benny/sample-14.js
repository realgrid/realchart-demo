const config = {
    annotations: {
        text: 'IN 1952',
        offsetX: 180,
        offsetY: 24,
        scope: 'container',
        align: 'center',
            style: {
                fontWeight: 'bold',
            },
    },
    title: {
        text: 'Gapminder Global Indicators',
        style: {
            fontWeight: 'bold'
        }
    },
    xAxis: {
        title: {
            text: 'GDP per Capita',
            style: {
                fontWeight: 'bold'
            }
        },
        grid: true,
        line: false
    },
    yAxis: {
        // reversed: true,
        title: {
            text: 'Life Expectancy',
            style: {
                fontWeight: 'bold'
            }
        },
        strictMin: 20,
        // strictMax: 120,
        tick: {
            stepInterval: 10,
        },
        grid: {
            visible: true,
            startVisible: false,
            endVisible: false
        },
    },
    legend: {
        location: 'right',
        verticalAlign: 'top'
    }
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
    createListBox(container, 'year', [1952, 1957, 1962, 1967, 1972, 1977, 1982, 1987, 1992, 1997, 2002, 2007], function (e) {
        config.series = createSeries(Number(_getValue(e)));
        config.annotations.text = 'IN ' + _getValue(e);
        chart.load(config, animate);
    }, 1952);
}

const createSeries = (year) => {
    let result = [];
    const continents = [...new Set(bubble.map((value) => value.continent))];

    const data = bubble.filter((value) => value.year === year);

    continents.forEach((continent, index) => {
        result.push({
            name: continent,
            type: 'bubble',
            tooltip: {
                text: 'country: ${country}<br>gdpPercap: ${x}<br>lifeExp: ${y}<br>pop: ${z}'
            },
            sizeMode: 'width',
            shape: 'rectangle',
            radius: 0.1,
            data: data.filter((value) => value.continent === continent).map((value) => {
                if (value.country === 'Kuwait') return;
                return {x: value.gdpPercap, y: value.lifeExp, z: value.pop, country: value.country}; 
            })
        });
    });


    return result;
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    config.series = createSeries(1952);
    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
