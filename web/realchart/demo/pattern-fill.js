/**
 * @demo
 *
 */
const config = {
	options: {
		// animatable: false,
	},
	title: 'Pattern Fill',
    assets: [{
        type: 'pattern',
        id: 'pattern-1',
        pattern: 0,
        style: {
            stroke: 'red',
            fill: 'red'
        }
    }],
	legend: true,
    body: {
        style: {
            stroke: 'none'
        }
    },
	xAxis: {
		title: {
			text: '수정구'
		},
        crosshair: true,
	},
	yAxis: {
		title: {
			text: '전체 인구수'
		},
	},
	series: {
		pointLabel: {
			visible: true,
			effect: 'outline', // 'background',
			style: {},
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
		style: {
            fill: 'url(#pattern-1)'
		},
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
	createListBox(
		container,
		'pattern',
		['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
		function (e) {
			config.assets[0].pattern = +_getValue(e);
			chart.load(config, animate);
		},
		'0'
	);
	createListBox(
		container,
		'color',
		['red', 'blue', 'green', 'gray'],
		function (e) {
			config.assets[0].style = { fill: _getValue(e), stroke: _getValue(e) };
			chart.load(config, animate);
		},
		'red'
	);
	
	createCodePenButton();
}

function init() {
	console.log(RealChart.getVersion());
	// RealChart.setDebugging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
