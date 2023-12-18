/**
 * @demo
 *
 */
const config = {
    "inverted": false,
    "title": {
      "visible": true,
      "text": "Axis Label Arrange",
      "style": {}
    },
    "subtitle": {
      "visible": false,
      "text": "Subtitle",
      "style": {}
    },
    "legend": {
      "visible": true,
      "alignBase": "plot",
      "gap": 6,
      "itemGap": 8,
      "itemsAlign": "center",
      "layout": "auto",
      "lineGap": 4,
      "location": "top",
      "markerGap": 4,
      "markerSize": 10,
      "style": {},
      "backgroundStyle": {}
    },
    "options": {
      "animatable": false,
      "credits": {
        "visible": false
      }
    },
    "xAxis": [
      {
        "visible": true,
        "type": "category",
        "title": {
          "visible": false,
          "text": "Axis title",
          "style": {}
        },
        "label": {
        //   "autoArrange": 'none',
          "rotation": -20,
          "visible": true,
          "style": {}
        },
        "grid": {
          "visible": true,
          "startVisible": false,
          "endVisible": false,
          "style": {}
        },
        "line": {
          "visible": false,
          "style": {}
        },
        "tick": {
          "visible": false,
          "gap": 3,
          "length": 7,
          "style": {}
        },
        "categories": [
          "09/18",
          "09/19",
          "09/20",
          "09/21",
          "09/22",
          "09/23",
          "09/24",
          "09/25",
          "09/26",
          "09/27",
          "09/28",
          "09/29",
          "09/30",
          "10/01",
          "10/02",
          "10/03",
          "10/04",
          "10/05",
          "10/06",
          "10/07",
          "10/08",
          "10/09",
          "10/10",
          "10/11",
          "10/12",
          "10/13",
          "10/14",
          "10/15",
          "10/16",
          "10/17"
        ]
      }
    ],
    "yAxis": [
      {
        strictMin: 0,
        maxValue: 35,
        "visible": true,
        "type": "linear",
        "title": {
          "visible": false,
          "text": "Axis title",
          "style": {}
        },
        "label": {
          "visible": true,
          "style": {}
        },
        "grid": {
          "visible": true,
          "startVisible": true,
          "endVisible": true,
          "style": {}
        },
        "line": {
          "visible": false,
          "style": {}
        },
        "tick": {
          "visible": false,
          "stepInterval": 5,
          "gap": 4,
          "length": 4,
          "style": {}
        }
      }
    ],
    "series": [
      {
        "visible": true,
        "type": "line",
        "name": "직원 사망 사고",
        "data": [
          0,
          0,
          0,
          0,
          0,
          5,
          0,
          2,
          1,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          4,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ],
        "baseValue": 0,
        "nullAsBase": false,
        "belowStyle": {},
        "pointLabel": {
          "visible": false,
          "style": {}
        },
        "colorByPoint": false,
        "tooltip": {
          "visible": false
        },
      },
      {
        "visible": true,
        "type": "line",
        "name": "기술탈취 의혹, 공정위 제소",
        "data": [
          0,
          0,
          0,
          0,
          0,
          5,
          0,
          2,
          1,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          5,
          0,
          0,
          0,
          0,
          0,
          4,
          20,
          4,
          0,
          0,
          0,
          0,
          0
        ],
        "baseValue": 0,
        "nullAsBase": false,
        "belowStyle": {},
        "pointLabel": {
          "visible": false,
          "style": {}
        },
        "colorByPoint": false,
        "tooltip": {
          "visible": false
        }
      },
      {
        "visible": true,
        "type": "line",
        "name": "고객 개인정보 유출",
        "data": [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          10,
          0,
          0,
          0,
          0,
          0,
          0,
          5,
          0,
          0,
          0,
          0,
          0,
          0
        ],
        "baseValue": 0,
        "nullAsBase": false,
        "belowStyle": {},
        "pointLabel": {
          "visible": false,
          "style": {}
        },
        "colorByPoint": false,
        "tooltip": {
          "visible": false
        },
      }
    ]
  }

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
		// chart.$_p.test(document.getElementById('canvas'));
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
    console.log("RealChart v" + RealChart.getVersion());
	// RealChart.setDebugging(true);
    RealChart.setLogging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
