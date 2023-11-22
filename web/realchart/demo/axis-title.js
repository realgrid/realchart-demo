/**
 * @demo
 * 
 * 축의 tick 위치증에 표시되는 text 라벨에 관련된 속성들을 알아본다.
 */
const config = {
    options: {
        // animatable: false
    },
    title: "Axis Title",
    xAxis: {
        title: {
            visible: false,
            text: 'X Axis Title',
        },
        categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', '마리아', 'Leon', 'Anna', 'Tim', 'Laura'],
        label: {
            // rotation: -90
        }
    },
    yAxis: {
        title: {
            visible: true,
            text: 'Y Axis Title',
            // rotation: 0,
        },
        grid: true
    },
    series: {
        pointLabel: {
            visible: true,
            // position: 'head',
            // offset: 10,
            // text: '<b style="fill:red">${x}</b>',
            effect: 'outline',// 'background',
            style: {
            },
        },
        data: [
            31231, 12311, 53453, 43242, 19953, 12000, 39021, 41001, 37800, 25123 
        ],
        style: {
            // fill: 'yellow'
        }
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
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X.reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X.opposite', function (e) {
        config.xAxis.position = _getChecked(e) ? 'opposite': 'normal';
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X.title', function (e) {
        config.xAxis.title.visible = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createListBox(container, "X.title.align", ['start', 'middle', 'end'], function (e) {
        config.xAxis.title.align = _getValue(e);
        chart.load(config);
    }, 'middle');
    createListBox(container, "X.title.offset", ['0', '10', '-10'], function (e) {
        config.xAxis.title.offset = _getValue(e);
        chart.load(config);
    }, '0');
    createCheckBox(container, 'Y.reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y.opposite', function (e) {
        config.yAxis.position = _getChecked(e) ? 'opposite': 'normal';
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y.title', function (e) {
        config.yAxis.title.visible = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createListBox(container, "Y.title.align", ['start', 'middle', 'end'], function (e) {
        config.yAxis.title.align = _getValue(e);
        chart.load(config);
    }, 'middle');
    createListBox(container, "Y.title.offset", ['0', '20', '-20', '-25'], function (e) {
        config.yAxis.title.offset = _getValue(e);
        chart.load(config);
    }, '0');
    createListBox(container, "Y.title.gap", ['0', '5', '20', '-20', '-72'], function (e) {
        config.yAxis.title.gap = _getValue(e);
        chart.load(config);
    }, '5');
    createListBox(container, "Y.title.rotation", ['', '0', '90', '270', '-90', '-270'], function (e) {
        config.yAxis.title.rotation = _getValue(e);
        chart.load(config);
    }, '');
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
