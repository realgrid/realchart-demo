/**
 * @demo
 *
 */
const config = {
	options: {
		// animatable: false,
		credits: {
			// visible: false,
			// verticalAlign: 'top',
			// align: 'center',
		},
	},
	title: '경기도 성남시 인구 현황',
	legend: true,
    body: {
        style: {
            stroke: 'none'
        }
    },
	xAxis: {
		tick:true,
		// type: 'category',
		// position: 'apposite'
		// position: 'base',
		// baseAxis: 1,
		title: {
			text: '수정구' + (Math.random() * 10000 >> 0)
		},
		// grid: true,
        crosshair: true,
	},
	yAxis: {
		title: {
			text: '전체 인구수'
		},
		// maxPadding: 0
		// strictMin: 1
	},
	series: {
        // visible: false,
		// baseValue: null,
		pointLabel: {
			visible: true,
			//position: 'head',
			// offset: 10,
			// text: '<b style="fill:red">${x}</b>',
			effect: 'outline', // 'background',
			style: {},
            styleCallback: args => args.yValue === args.yMax ? { fill: 'red', fontSize: '20px', background: {} } : null
		},
		data: [
			['신흥1동', 12904],
			['신흥2동', 19796],
			['신흥3동', 10995],
			['태평1동', 14625],
			['태평2동', 14627],
			['태평3동', 12649],
			['태평4동', 12279],
		],
		data2: [
			[1, 7],
			[2, 11],
			[3, 9],
			[4, 10],
			[5, 14.3],
			[6, 13],
			[7, 12.5],
		],
		style: {
			// fill: 'yellow'
		},
		// onPointClick: args => {
		//     alert(JSON.stringify(args));
		// }
	},
};

let animate;
let chart;

function createCodePenButton() {
	let elements = document.getElementById('actions');

	let data = {
		title: 'Cool Pen',
		description: '',
		html: '<script src="https://unpkg.com/realchart"></script>\n<div id="realchart"></div>',
		html_pre_processor: 'none',
		css: '@import url("https://unpkg.com/realchart/dist/realchart-style.css");\n#realchart {\n    width: 100%;\n    height: 550px;\n    border: 1px solid lightgray;\n    margin-bottom: 20px;\n}',
		css_pre_processor: 'none',
		css_starter: 'neither',
		css_prefix_free: false,
		js:
			'const config = ' +
			JSON.stringify(config, null, 2) +
			'; \n  chart = RealChart.createChart(document, "realchart", config);',
		js_pre_processor: 'none',
		js_modernizr: false,
		js_library: '',
		html_classes: '',
		css_external: '',
		js_external: '',
		template: true,
	};

	let JSONstring = JSON.stringify(data)
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

	let form = document.createElement('form');
	form.setAttribute('action', 'https://codepen.io/pen/define');
	form.setAttribute('method', 'POST');
	form.setAttribute('target', '_blank');

	let inputData = document.createElement('input');
	inputData.setAttribute('type', 'hidden');
	inputData.setAttribute('name', 'data');
	inputData.setAttribute('value', JSONstring);
	form.appendChild(inputData);

	let inputSubmit = document.createElement('input');
	inputSubmit.setAttribute('type', 'submit');
	inputSubmit.setAttribute('value', 'Code Pen');
	form.appendChild(inputSubmit);

	elements.appendChild(form);
}

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
	createButton(container, 'Test', function (e) {
		// alert('hello');
        // alert(RealChart.getVersion());
        // chart.series.visible = !chart.series.visible;
        // chart.series.set('visible', !chart.series.get('visible'));
        // chart.series.toggle('visible');
        // chart.series.set('pointLabel', false);
        // chart.series.toggle('pointLabel.visible');
        // chart.series.pointLabel.toggle('visible');
	});
	createCheckBox(
		container,
		'Inverted',
		function (e) {
            config.inverted = _getChecked(e);
			chart.load(config, animate);
		},
		false
	);
	createCheckBox(
		container,
		'X Reversed',
		function (e) {
			config.xAxis.reversed = _getChecked(e);
			chart.load(config, animate);
		},
		false
	);
	createCheckBox(
		container,
		'Y Reversed',
		function (e) {
			config.yAxis.reversed = _getChecked(e);
			chart.load(config, animate);
		},
		false
	);
	createCheckBox(
		container,
		'X Opposite',
		function (e) {
			config.xAxis.position = _getChecked(e) ? 'opposite' : '';
			chart.load(config, animate);
		},
		false
	);
	createCodePenButton();
}

function init() {
	console.log(RealChart.getVersion());
	// RealChart.setDebugging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
