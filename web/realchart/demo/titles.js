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
        text: "<b>2023.01</b> <a href='https://www.worldbank.org/en/home'>World Bank.</a>",
        style: {
            fill: 'gray',
            // fontStyle: 'italic'
        },
        // backgroundStyle: {
        //     fill: 'black',
        //     padding: "2px 4px"
        // }
    },
    xAxis: {
        title: 'X Axis',
        grid: true,
        categories: [
            'Jan', 'Feb', 'Mar',
            'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
          ]
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
            [ -130 ], [ -100 ],
            [ -50 ],  [ 60 ],
            [ 70 ],   [ 115 ],
            [ 90 ],   [ 100 ],
            [ 120 ],  [ 130 ],
            [ 140 ],  [ 160 ]
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
