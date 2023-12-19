const config = {
    title: false,
    options: {
        style: {
            backgroundColor: '#363A46'
        }
    },
    series: {
        type: 'treemap',
        startDir: 'vertical',
        algorithm: 'squarify',
        alternate: false,
        groupMode: true,
        tooltipText: 'group: ${group}<br>value: ${value}',
        pointLabel: {
            visible: true,
            text: '${x}<br>${value}',
            effect: 'outline',
        },
        data: {}
    }
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
    createListBox(container, "series.algorithm", ['squarify', 'strip', 'sliceDice', 'slice'], function (e) {
        config.series.algorithm = _getValue(e);
        chart.load(config, animate);
    }, 'squarify');
}

const createData = () => {
    let result = [];
    const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#ecf0f1', '#d35400', '#2c3e50'];
    const sectors = [...new Set(data.map((value) => {
        return value.Sector;
    }))];
    sectors.forEach((sector, index) => {
        const sectorByData = data.filter((value) => value.Sector === sector);
        result.push({ 'id': sector, 'name': sector});

        const industries = [...new Set(sectorByData.map((value) => {
            return value.Industry;
        }))];

        industries.forEach((industry, index) => {
            result.push({ 'id': industry, 'name': industry, 'group': sector, 'color': colors[index]});
        });
    });
    data.forEach((value) => {
        result.push({
            'name': value.Ticker,
            'group': value.Industry,
            'value': value['Market Cap']
        });
    });
    return result;
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    config.series.data = createData();
    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
