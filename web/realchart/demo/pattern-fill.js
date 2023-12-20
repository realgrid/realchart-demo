/**
 * @demo
 *
 */
const config = {
	options: {
	},
	title: 'Pattern Fill',
    assets: [{
        type: 'pattern',
        id: 'pattern-0',
        pattern: 0,
        style: {
            stroke: 'black',
        }
    },
	{
        type: 'pattern',
        id: 'pattern-1',
        pattern: 1,
    },
	{
        type: 'pattern',
        id: 'pattern-2',
        pattern: 2,
    },
	{
        type: 'pattern',
        id: 'pattern-3',
        pattern: 3,
    },
	{
        type: 'pattern',
        id: 'pattern-4',
        pattern: 4,
    },
	{
        type: 'pattern',
        id: 'pattern-5',
        pattern: 5,
    },
	{
        type: 'pattern',
        id: 'pattern-6',
        pattern: 6,
    },
	{
        type: 'pattern',
        id: 'pattern-7',
        pattern: 7,
    },
	{
        type: 'pattern',
        id: 'pattern-8',
        pattern: 8,
    },
	{
        type: 'pattern',
        id: 'pattern-9',
        pattern: 9,
    },
	{
        type: 'pattern',
        id: 'pattern-10',
        pattern: 10,
    },
	{
        type: 'pattern',
        id: 'pattern-11',
        pattern: 11,
    },
	{
        type: 'pattern',
        id: 'pattern-12',
        pattern: 12,
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
	},
	yAxis: {
		title: {
			text: '전체 인구수'
		},
	},
	tooltip: false,
	series: [{
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
            fill: 'url(#pattern-0)'
		},
	},{
        type: 'pie',
        centerX: '80%',
        centerY: '40%',
        radius: '30%',
        legendByPoint: true,
		pointStyleCallback: ({index}) => {
			return {
				fill: `url(#pattern-${index})`,
				stroke: '#FFF',
				strokeWidth: '4px'
			}
		},
        data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }],
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
		['black', 'red', 'blue', 'green', 'gray'],
		function (e) {
			config.assets[0].style = { fill: _getValue(e), stroke: _getValue(e) };
			chart.load(config, animate);
		},
		'black'
	);
	
	createCodePenButton();
}

function init() {
	console.log(RealChart.getVersion());
	// RealChart.setDebugging(true);
    RealChart.setLogging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
