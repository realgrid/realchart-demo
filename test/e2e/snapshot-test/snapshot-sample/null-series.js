export const config = {
    title: '연도별 서울시 평균 대기질 지수',
    xAxis: {
		title: '서울시',
		categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020'],
			grid: {
				visible: true,
			},
    },
    yAxis: {
      	title: '대기질 지수<br><t style="fill:gray;font-size:0.9em;">(Air Quality Index, AQI)</t>',
    },
    series: [
		{
			name: '대기질',
			pointLabel: true,
			data: [155, 138, 122, 133, 114, 113, 123],
		},
		{
			name: '대기질2',
			pointLabel: true,
			data: [131, 142, 156, 194, 201, 144, 184],
		},
		{
			name: '대기질3',
			pointLabel: true,
			data: [null, null, null, null, null, null, null],
		},
	],
};
