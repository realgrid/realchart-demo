/**
 * @demo
 * 
 */
const config = {
    options: {
        animatable: false
    },
    title: "Bar Group",
    xAxis: {
        title: "일일 Daily fat",
        categories: ['쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도'],
        grid: true
    },
    yAxis: [{
        title: "Employees",
    }, {
        title: "Profit (millions)",
        position: 'opposite',
        grid: false,
        tick: {
            baseAxis: 0
        }
    }],
    series: [{
        groupPadding: 0.1,
        layout: 'overlap',
        children: [{
            name: 'Employees',
            color: 'rgba(165,170,217,1)',
            // pointWidth: '100%',
            data: [150, 73, 20]
        }, {
            name: 'Employees Optimized',
            color: 'rgba(126,86,134,.9)',    
            pointPadding: 0.3,
            data: [140, 90, 40]
        }]
    }, {
        groupPadding: 0.1,
        layout: 'overlap',
        yAxis: 1,
        children: [{
            name: 'Profit',
            color: 'rgba(248,161,63,1)',
            data: [183.6, 178.8, 198.5]
        }, {
            name: 'Profit Optimized',
            color: 'rgba(186,60,61,.9)',
            pointPadding: 0.3,
            data: [203.6, 198.8, 208.5]
        }]
    }]
};

RealChart.createChart(document, 'realchart', config);

