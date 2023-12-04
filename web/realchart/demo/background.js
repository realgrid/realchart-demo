/**
 * @demo
 * 
 */
const config = {
    title: "Chart Background",
    options: {
        style: {
            backgroundImage: 'url(../assets/mountain.jpeg)'
        }
    },
    xAxis: {
        categories: ['쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도'],
        title: {
            text: "일일 Daily fat",
        },
        tick: {
        },
        label: {
        },
        grid: true,
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
        // reversed: true,
        // baseValue: -1
    },
    series: [{
        name: 'column1',
        pointLabel: {
            visible: true,
            position: 'inside',
            effect: 'outline'
        },
        // pointWidth: '100%',
        data: [11, 22, 15, 9, 13, 27]
    }, {
        name: 'line1',
        type: 'line',
        pointLabel: true,
        color: 'black',
        data: [9, 17, 19, 11, 10, 21],
        style: {
            strokeDasharray: '5'
        }
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
    }, false);
    createListBox(container, "backgroundStyle.fill", ['', 'black', 'yellow'], function (e) {
        config.options.style.backgroundColor = _getValue(e);
        chart.load(config);
    }, '');
    createCheckBox(container, 'backgroundImage', function (e) {
        config.options.style.backgroundImage = _getChecked(e) ? 'url(../assets/mountain.jpeg)' : '';
        chart.load(config);
    }, true);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
