const continents = [...new Set(data.map((value) => value.continent))];

const createSeries = (year) => {
    let result = [];
    const {
        data,
        params: { continents },
    } = tool;
    const dataPerYear = data.filter((value) => value.year === year);

    continents.forEach((continent, index) => {
        result.push({
            name: continent,
            type: 'bubble',
            tooltipText:
                'country: ${country}<br>gdpPercap: ${x}<br>lifeExp: ${y}<br>pop: ${z}',
            sizeMode: 'width',
            // shape: 'rectangle',
            radius: 0.1,
            data: dataPerYear
                .filter((value) => value.continent === continent)
                .map((value) => {
                    if (value.country === 'Kuwait') return;
                    return {
                        x: value.gdpPercap,
                        y: value.lifeExp,
                        z: value.pop,
                        country: value.country,
                    };
                }),
        });
    });

    return result;
};
const tool = {
    data,
    params: {
        continents,
        createSeries,
    },
    actions: [
        {
            type: 'slider',
            min: 1952,
            max: 2007,
            step: 5,
            field: 'year',
            label: 'Year',
            target: 'data',
            action: ({ tool, config, value }) => {
                // config.annotations.text = 'IN ' + value;
                config.title.text = `Gapminder Global Indicators IN ${value}`;
                config.series = tool.params.createSeries(value);
                chart.load(config);
            },
        },
    ],
};
const config = {
    options: {
        credits: false,
    },
    // annotations: {
    //     text: 'IN 1952',
    //     offsetX: 180,
    //     offsetY: 24,
    //     scope: 'container',
    //     align: 'center',
    //         style: {
    //             fontWeight: 'bold',
    //         },
    // },
    title: {
        text: 'Gapminder Global Indicators IN 1952',
        style: {
            fontWeight: 'bold',
        },
    },
    xAxis: {
        title: {
            text: 'GDP per Capita',
            style: {
                fontWeight: 'bold',
            },
        },
        grid: true,
        line: false,
    },
    yAxis: {
        // reversed: true,
        title: {
            text: 'Life Expectancy',
            style: {
                fontWeight: 'bold',
            },
        },
        strictMin: 20,
        strictMax: 90,
        tick: {
            stepInterval: 10,
        },
        grid: {
            visible: true,
            firstVisible: false,
            lastVisible: false,
        },
    },
    legend: {
        location: 'right',
        verticalAlign: 'top',
    },
};

let animate = false;
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
    createCheckBox(
        container,
        'Always Animate',
        function (e) {
            animate = _getChecked(e);
        },
        false
    );
    createButton(container, 'Test', function (e) {
        alert('hello');
    });
    createListBox(
        container,
        'year',
        [
            1952, 1957, 1962, 1967, 1972, 1977, 1982, 1987, 1992, 1997, 2002,
            2007,
        ],
        function (e) {
            config.series = createSeries(Number(_getValue(e)));
            //   config.annotations.text = 'IN ' + _getValue(e);
            chart.load(config, animate);
        },
        1952
    );
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    config.series = createSeries(1952);
    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
