
const config = {
	title: '2022년도 도시의 평균 대기질 지수',
	xAxis: {
		title: '수정구',
	},
	yAxis: {
		title: '대기질 지수(Air Quality Index, AQI)',
	},
    legend: {
        visible: true // <-- 여기 변경...
    },
	series: {
		pointLabel: {
			visible: true,
			numberSymbols: ""
		},
		data: [
			['신흥1동', 129012],
			['신흥2동', 197960],
			['신흥3동', 109959],
			['태평1동', 146250],
			['태평2동', 146270],
			['태평3동', 126409],
			['태평4동', 122079],
		],
	},
	ChartTextEffect: {
		autoContrast: false,
	},
};

RealChart.createChart(document, 'realchart', config);
