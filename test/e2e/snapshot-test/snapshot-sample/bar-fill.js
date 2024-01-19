export const config = {
  title: {
    template: "title",
    text: "소싱처리 준수율",
  },
  templates: {
    series: {
      pointPadding: 0,
      pointLabel: {
        visible: true,
        position: "inside",
        effect: "outline",
        textCallback: (args) => {
          if(args.y > 1){
            return args.y
          }
          return " "
        }
      },
    },
  },
  xAxis: {
    type: "category",
    categories: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
  },
  yAxis: {
    type: "linear",
    strictMax: 100,
    title: {
      text: "단위: %",
      align: "end",
      style:{
        fontSize: 12,
        fill: "gray"
      }
    },
  },
  series: [
    {
      layout: "fill",
      children: [
        {
          template: "series",
          name: "0~3일 이상",
          data: [95.3, 93.3, 94, 88.4, 88.9, 88.9, 74.5, 74.6, 87.5, 10, 10, 10],
        },
        {
          template: "series",
          name: "4~5일 이상",
          data: [4.3, 4.9, 0.4, 8, 10.6, 6.7, 21.7, 10.7, 6.3, 0, 0, 0],
        },
        {
          template: "series",
          name: "6~7일 이상",
          data: [0.4, 0.6, 0.8, 2.2, 0.5, 1.8, 1.3, 1, 6.3, 0, 0, 0],
        },
        {
          template: "series",
          name: "8~9일 이상",
          data: [0, 1.2, 2.4, 0.7, 0, 1.3, 1.7, 0, 0, 0, 0, 0],
        },
        {
          template: "series",
          name: "10일 이상",
          data: [0, 0, 2.4, 0.7, 0, 1.3, 0.9, 13.7, 0, 0, 0, 0],
        },
      ],
    },
    {
      type: "line",
      name: "목표율",
      data: [95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95],
      style: {
        fill: "red",
        stroke: "red",
      },
      marker: {
        style: {
          fill: "#fff",
        },
      },
    },
  ],
};
