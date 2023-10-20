/**
 * @demo
 * 
 */
export const config = {
    title: {
        text: "Chart Title",
        style: {
            textDecoration: 'underline'
        }
    },
    subtitle: {
        text: "Sub Title",
        style: {
            fill: 'red'
        }
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
            // backgroundStyle: {
            //     fill: '#004',
            //     padding: '5px'
            // }
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
        chart.refresh();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    line(container);
    createCheckBox(container, 'Title', function (e) {
        config.title.visible = _getChecked(e);
        chart.load(config);
    }, true);
    createListBox(container, "alignBase", ['plot', 'chart'], function (e) {
        config.title.alignBase = _getValue(e);
        chart.load(config);
    }, 'plot');
    createListBox(container, "align", ['left', 'center', 'right'], function (e) {
        config.title.align = _getValue(e);
        chart.load(config);
    }, 'center');
    line(container);
    createCheckBox(container, 'Subtitle', function (e) {
        config.subtitle.visible = _getChecked(e);
        chart.load(config);
    }, true);
    createListBox(container, "alignBase", ['plot', 'chart'], function (e) {
        config.subtitle.alignBase = _getValue(e);
        chart.load(config);
    }, 'plot');
    createListBox(container, "align", ['left', 'center', 'right'], function (e) {
        config.subtitle.align = _getValue(e);
        chart.load(config);
    }, 'center');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
