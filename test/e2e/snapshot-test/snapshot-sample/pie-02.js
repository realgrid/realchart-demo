export const config = {
    title: "외부 고객사 매출비중",
    series: [
		{
			type: "pie",
			data: [
				{ name: "주식회사 천보", y: 840,  },
				{ name: "씨피켐주식회사", y: 22 },
				{ name: "외부고객사", y: 17 },
				{ name: "에이치디씨(주)", y: 13 },
				{ name: "영광정공(주)", y: 6 },
			],
			legendByPoint: true,
			pointLabel: {
				visible: true,
				position: "inside",
				effect: "outline",
				textCallback: (args) => {
					const total = data.reduce((acc, curr) => acc + (curr.y || 0), 0);
					const percentage = (args.yValue / total) * 100;
					return percentage.toFixed(1)+'%';
				},
			},
			tooltipText: "${x} <br> 매출비중: ${y} / ${}",
			tooltipCallback: (args) => {
				const total = data.reduce((acc, curr) => acc + (curr.y || 0), 0);
				return `${args.x} <br> 매출비중: ${(args.yValue / total * 100).toFixed(1)}%`;
			}
		},
    ],
    legend: {
		visible: true,
		location: "right",
    },
};
