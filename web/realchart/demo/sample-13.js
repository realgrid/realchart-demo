const config = {
    options: {
        credits: {
            text: 'Source: Korea Cloud Opportunity Forecost by Industry, 2021-2025',
            url: 'https://www.idc.com/getdoc.jsp?containerId=AP47751622',
            align: 'left',
            offsetY: -15
        }
    },
    title: {
        text: '국내 퍼블릭 IT 클라우드 서비스 시장 전망',
        style: {
            fill: '#0056B3',
            fontWeight: 'bold',
            fontSize: '26px'
        },
    },
    subtitle: {
        text: '(2020년 - 2025년)',
        style: {
            fill: '#0056B3',
            fontWeight: 'bold',
            fontSize: '22px'
        },
    },
    annotations: [{
        type: 'image',
        width: 140,
        scope: 'container',
        imageUrl: '../assets/images/idc.png',
        align: 'left',
        offsetX: 10,
        offsetY: -10,
    },{
        text: '전년대비 성장률',
        offsetX: 10,
        offsetY: 50,
        scope: 'container',
        align: 'right',
            style: {
                fill: '#0056B3',
                fontWeight: 'bold',
                fontSize: '18px'
            },
    }],
    legend: {
        layout: 'vertical',
        itemsPerLine: 2,
        lineGap: 40
    },
	xAxis: {
        categories: [
            '2020', '2021', '2022', '2023', '2024', '2025'
        ],
	},
	yAxis: [{
        strictMin: 0,
        strictMax: 100,
        label: {
            suffix: '%'
        },
        tick: {
            stepInterval: 20,
        },
	},{
        tick: {
            stepInterval: 5,
        },
        label: {
            suffix: '%'
        },
        strictMin: 0,
        strictMax: 30,
        grid: false,
        position: 'opposite'
    }],
	series: [
		{
            layout: 'fill',
			children: [
				{
					name: '제조',
					pointLabel: {
						visible: true,
						position: 'inside',
                        suffix: '%'
					},
					data: [31.6, 30.3, 29, 27.8, 26.6, 25.4],
				},
				{
					name: '미디어/서비스',
					pointWidth: 2,
					pointLabel: {
						visible: true,
						position: 'inside',
                        suffix: '%'
					},
					data: [22.6, 23.1, 23.6, 24.2, 24.9, 25.6],
				},
				{
					name: '유통/운송',
					data: [19.6, 19.3, 19.5, 19.2, 19.4, 19.6],
                    pointLabel: false
				},
				{
					name: '금융',
					data: [9.2, 8.9, 9.1, 9.9, 9.3, 9],
                    pointLabel: false
				},
				{
					name: '기타',
					data: [17.3, 18.4, 17.5, 18.9, 19.8, 20.4],
                    pointLabel: false
				},
			],
		},{
            name: '전년대비 성장률 (%)',
            style: {
                strokeDasharray: '12 4',
                strokeWidth: '5px',
                fill: '#0056B3',
                stroke: '#0056B3'
            },
            yAxis: 1,
            type: 'line',
            data: [26.2, 18.1, 16.2, 14.8, 13.9, 13.6]
        }
	],
};

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
    createCheckBox(container, 'series.alternate', function (e) {
        config.series.alternate = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'series.groupMode', function (e) {
        config.series.groupMode = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createListBox(container, "series.startDir", ['vertical', 'horizontal'], function (e) {
        config.series.startDir = _getValue(e);
        chart.load(config, animate);
    }, 'vertical');
    createListBox(container, "series.algorithm", ['squarify', 'strip', 'sliceDice', 'slice'], function (e) {
        config.series.algorithm = _getValue(e);
        chart.load(config, animate);
    }, 'squarify');
}

const createData = () => {
    let result = [];
    const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#ecf0f1', '#d35400', '#2c3e50'];
    const sectors = [...new Set(data.map((value) => {
        return value.Sector;
    }))];
    sectors.forEach((sector, index) => {
        const sectorByData = data.filter((value) => value.Sector === sector);
        result.push({ 'id': sector, 'name': sector});

        const industries = [...new Set(sectorByData.map((value) => {
            return value.Industry;
        }))];

        industries.forEach((industry, index) => {
            console.log(colors[index])
            result.push({ 'id': industry, 'name': industry, 'group': sector, 'color': colors[index]});
        });
    });
    data.forEach((value) => {
        result.push({
            'name': value.Ticker,
            'group': value.Industry,
            'value': value['Market Cap']
        });
    });
    return result;
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    config.series.data = createData();
    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
