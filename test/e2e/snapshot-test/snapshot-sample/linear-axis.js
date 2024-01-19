export const config = {
	title: "Boundary",
	xAxis: {
		type: "linear",
		tick: {
			visible: true,
		},
	},
	body:{
		padding: 100,
	},
	series: [
		{
			type: 'bar',
			name: "column",
			data: [1, 2, 4, 8],

		},
	],
	tooltip: {
		text: "%{y}"
	}
};
