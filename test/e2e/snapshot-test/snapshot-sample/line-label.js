export const config = {
    options: {
    },
    title: "Line Series - Point Labels",
    xAxis: {
        type: 'category',
    },
    yAxis: {
    },
    series: {
        type: 'line',
        marker: true,
        pointLabel: {
            visible: true,
        },
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['카눈', 8], 
            ['def', 9], 
            ['머핀', 11], 
            ['지리산', 15.3], 
            ['zzz', 13],
            ['낙동강', 12.5]
        ]
    }
}
