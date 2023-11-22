/**
 * @demo
 * 
 */
const config = {
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
    createListBox(container, "title.alignBase", ['plot', 'chart'], function (e) {
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
    line(container);
    createCheckBox(container, 'Subtitle', function (e) {
        config.subtitle.visible = _getChecked(e);
        chart.load(config);
    }, true);
    createListBox(container, "subtitle.position", ['top', 'bottom', 'left', 'right'], function (e) {
        config.subtitle.position = _getValue(e);
        chart.load(config);
    }, 'bottom');
    createListBox(container, "subtitle.alignBase", ['plot', 'chart', 'parent'], function (e) {
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
    createButton(container, 'PNG', function (e) {
		chart.exportImage();
	});
	createButton(container, 'JPG', function (e) {
		chart.exportImage({type: 'jpg'});
	});
	createButton(container, 'JPEG', function (e) {
		chart.exportImage({type: 'jpeg'});
	});
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
