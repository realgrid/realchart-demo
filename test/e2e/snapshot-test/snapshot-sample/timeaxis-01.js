export const config = {
    options: {},
    title: 'Time Axis 01',
    xAxis: {
        type: 'time',
        tick: {
            stepInterval: '2d',
        },
        label: {
            timeFormat: 'yyyy-MM-dd',
        },
    },
    yAxis: {},
    series: {
        type: 'line',
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4,
        ],
        xStart: new Date(2010, 0, 1),
        xStep: 24 * 3600 * 1000,
    },
};
