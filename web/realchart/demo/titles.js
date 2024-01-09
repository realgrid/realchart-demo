/**
 * @demo
 * 
 */
const config = {
    title: {
        text: "Chart Title",
        // style: {
        //     textDecoration: 'underline',
        // },
        style: {
            fill: 'white'
        },
        backgroundStyle: {
            fill: '#333',
            padding: '1px 4px',
            rx: '4'
        }
    },
    subtitle: {
        text: "Sub Title",
        text: "2023.01 World Bank.",
        style: {
            fill: 'red',
            fill: 'gray',
            fontStyle: 'italic'
        },
        // backgroundStyle: {
        //     fill: 'black',
        //     padding: "2px 4px"
        // }
    },
    xAxis: {
        // type: 'category',
        // position: 'apposite'
        // position: 'base',
        // baseAxis: 1,
        title: 'X Axis',
        grid: true
    },
    yAxis: {
        title: 'Y Axis',
    },
    series: {
        pointLabel: {
            visible: true,
            position: 'head',
            // offset: 10,
            // text: '<b style="fill:red">${x}</b>',
            effect: 'outline',// 'background',
            style: {
            },
        },
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['def', 9], 
            ['지리산', 14.3], 
            ['zzz', 13],
            ['낙동강', 12.5]
        ],
        style: {
            // fill: 'yellow'
        }
    }
}
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    line(container);
    createCheckBox(container, 'Title', function (e) {
        config.title.visible = _getChecked(e);
        chart.load(config);
    }, true);
    createListBox(container, "title.alignBase", ['body', 'chart'], function (e) {
        config.title.alignBase = _getValue(e);
        chart.load(config);
    }, 'plot');
    createListBox(container, "title.align", ['left', 'center', 'right'], function (e) {
        config.title.align = _getValue(e);
        chart.load(config);
    }, 'center');
    createListBox(container, "title.verticalAlign", ['top', 'middle', 'bottom'], function (e) {
        config.title.verticalAlign = _getValue(e);
        chart.load(config);
    }, 'middle');
    createListBox(container, "title.gap", ['0', '10', '20'], function (e) {
        config.title.gap = _getValue(e);
        chart.load(config);
    }, '10');
    line(container);
    createCheckBox(container, 'Subtitle', function (e) {
        config.subtitle.visible = _getChecked(e);
        chart.load(config);
    }, true);
    createListBox(container, "subtitle.position", ['top', 'bottom', 'left', 'right'], function (e) {
        config.subtitle.position = _getValue(e);
        chart.load(config);
    }, 'bottom');
    createListBox(container, "subtitle.alignBase", ['body', 'chart', 'parent'], function (e) {
        config.subtitle.alignBase = _getValue(e);
        chart.load(config);
    }, 'plot');
    createListBox(container, "subtitle.align", ['left', 'center', 'right'], function (e) {
        config.subtitle.align = _getValue(e);
        chart.load(config);
    }, 'center');
    createListBox(container, "subtitle.verticalAlign", ['top', 'middle', 'bottom'], function (e) {
        config.subtitle.verticalAlign = _getValue(e);
        chart.load(config);
    }, 'bottom');
    createListBox(container, "subtitle.gap", ['0', '10', '20'], function (e) {
        config.subtitle.gap = _getValue(e);
        chart.load(config);
    }, '10');
    createListBox(container, "subtitle.titleGap", ['0', '2', '10'], function (e) {
        config.subtitle.titleGap = _getValue(e);
        chart.load(config);
    }, '2');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
