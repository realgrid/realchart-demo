/**
 * @demo
 * 
 * 축의 특정한 위치나 범위를 강조해서 표시하는 방법.
 */
const config = {
    options: {
    },
    title: "Annotations",
    legend: true,
    xAxis: {
        // type: 'category',
        tick: true,
        // position: 'apposite'
        // position: 'base',
        // baseAxis: 1,
        title: 'X Axis',
        grid: true
    },
    yAxis: {
        tick: true,
        title: 'Y Axis'
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
    },
    body: {
        annotations: [{
            offsetX: 30,
            offsetY: 40,
            rotation: -20,
            text: 'Annotation Sample',
            style: {
                fill: 'white'
            },
            backgroundStyle: {
                padding: '3px 5px',
                fill: '#33f',
                rx: 5,
                fillOpacity: 0.7
            }
        }, {
            imageUrl: '../assets/images/daum.png',
            align: 'right',
            offsetX: 50,
            offsetY: 0,
            width: 150,
        }]
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
    createCheckBox(container, 'inverted', function (e) {
        RealChart.setDebugging(_getChecked(e));
        config.inverted = _getChecked(e);
        chart.load(config);
    }, false);
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
