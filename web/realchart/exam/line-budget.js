
const budgetData = data.filter(row => row['Medicare']);

const actualSpending = [83.1, 89.0, 101.1, 110.2, 120.6, 136.0, 150.0, 167.7, 184.4, 198.7, 210.4, 209.4, 213.2, 224.8, 247.7, 265.4, 282.7, 311.1, 339.8, 403.7, 432.7, 467.0, 498.6, 519.5, 544.6, 568.3, 588.9, 617.3, 647.9, 675.9, 704.9, 749.6, 802.0, 831.2, 900.8]
const actualSpendingFrom = 1987;
const spendingData = actualSpending.map((v, i) => {
    return [actualSpendingFrom + i, v];
});

const lastVisiblePointLabel = (fill) => {
    return {
        text: `<t style="font-size:20px;fill:${fill}">$ \${y}</t>\n\${x}`,
        visibleCallback: (args) => {
            return args.count == (args.index + 1);
        }
    }
}

const budgetSeries = {
    name: 'budget',
    type: 'line',
    xField: 'Year',
    yField: 'Medicare',
    marker: {
        visible: true,
        firstVisible: 'visible',
        lastVisible: 'visible',
        
    },
    pointLabel: lastVisiblePointLabel('var(--color-9)'),
    style: {
        fill: 'var(--color-9)',
        stroke: 'var(--color-9)',
    }
}
const spendingSeries = {
    name: 'spending',
    type: 'line',
    marker: false,
    style: {
        strokeWidth: 4,
        stroke: 'var(--color-5)',
        strokeDasharray: '1 0 1 0'
    },
    pointLabel: lastVisiblePointLabel('var(--color-5)'),
    data: spendingData,
}

const config = {
    // inverted: true,
    options: {
        // animatable: false
    },
    title: {
        text: 'Annual Medicare Budget (Unit: bUSD)',
        gap: 10,
        align: 'left',
        style: {
            fontSize: '12pt',
            fontWeight: 700,
            fontFamily: 'Roboto'
        },
    },
    legend: {
        visible: false,
        align: 'left',
        itemGap: 20,
        markerGap: 10,
        offsetX: 20,
        style: {
            marginRight: '20px'
        }
    },
    xAxis: {
        type: 'linear',
        strictMax: 2030,
        // type: 'category'
        tick: true,
    },
    yAxis: {
        type: 'linear',
        minValue: 0,
        strictMax: 1000,
        label: {
            prefix: '$'
        }
    },
    series: [
        spendingSeries,
        budgetSeries,
    ]
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
    createListBox(container, "Line Type", ['default', 'spline', 'step'], function (e) {
        config.series.lineType = _getValue(e);
        chart.load(config, animate);
    }, 'default');
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');

    const years = [1983, 1995, 2011, 2023];
    const budgetDataArr = years.map(year => budgetData.filter(row => row.Year <= year));
    
    let cnt = 0;
    let idx = cnt++ % 4;
    
    // chart.load({
    //     ...config,
    //     series: {
    //         ...config.series,
    //         data: budgetDataArr[idx],
    //     }
    // })
    const budget = chart.getSeries('budget');
    budget.updateData(budgetDataArr[idx])
    
    setInterval(() => {
        idx = cnt++ % 4;
        // const year = years[idx];
        // const series = chart.getSeries('line');
        budget.updateData(budgetDataArr[idx]);
        // chart.load({
        //     ...config,
        //     series: {
        //         ...config.series,
        //         data: budgetDataArr[idx],
        //     }
        // })
        // chart.load({
        //     ...config,
        //     series: {
        //         ...config.series,
        //         data: budgetDataArr[idx]
        //     }
        // }, true);
    }, 1000);
}
