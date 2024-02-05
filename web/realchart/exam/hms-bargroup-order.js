/**
 * @demo
 *
 */

// 전화 방문
const callData = [
    {
        date: '2023-01',
        건수: 291,
        비율: 27,
        수량: 486635,
        금액: 214871400
    },
    {
        date: '2023-02',
        건수: 303,
        비율: 27,
        수량: 379875,
        금액: 184258700
    },
    {
        date: '2023-03',
        건수: 335,
        비율: 26,
        수량: 459635,
        금액: 220016450
    },
    {
        date: '2023-04',
        건수: 309,
        비율: 27,
        수량: 382600,
        금액: 183214670
    },
    {
        date: '2023-05',
        건수: 331,
        비율: 28,
        수량: 423995,
        금액: 198393420
    },
    {
        date: '2023-06',
        건수: 295,
        비율: 25,
        수량: 378392,
        금액: 174201670
    },
    {
        date: '2023-07',
        건수: 294,
        비율: 26,
        수량: 392243,
        금액: 186954990
    },
    {
        date: '2023-08',
        건수: 326,
        비율: 24,
        수량: 439525,
        금액: 208954460
    },
    {
        date: '2023-09',
        건수: 325,
        비율: 26,
        수량: 523731,
        금액: 238851890
    },
    {
        date: '2023-10',
        건수: 290,
        비율: 26,
        수량: 364470,
        금액: 175441660
    },
    {
        date: '2023-11',
        건수: 318,
        비율: 25,
        수량: 409275,
        금액: 200402760
    },
    {
        date: '2023-12',
        건수: 87,
        비율: 29,
        수량: 95315,
        금액: 49679510
    }
];

const internetData = [
    {
        date: '2023-01',
        건수: 785,
        비율: 73,
        수량: 822135,
        금액: 372507210
    },
    {
        date: '2023-02',
        건수: 838,
        비율: 74,
        수량: 784375,
        금액: 373433380
    },
    {
        date: '2023-03',
        건수: 932,
        비율: 74,
        수량: 903300,
        금액: 427731650
    },
    {
        date: '2023-04',
        건수: 819,
        비율: 73,
        수량: 774695,
        금액: 369421420
    },
    {
        date: '2023-05',
        건수: 852,
        비율: 72,
        수량: 820923,
        금액: 391699140
    },
    {
        date: '2023-06',
        건수: 865,
        비율: 75,
        수량: 833760,
        금액: 391009250
    },
    {
        date: '2023-07',
        건수: 851,
        비율: 74,
        수량: 860203,
        금액: 387640650
    },
    {
        date: '2023-08',
        건수: 1009,
        비율: 76,
        수량: 966865,
        금액: 465275040
    },
    {
        date: '2023-09',
        건수: 910,
        비율: 74,
        수량: 1030490,
        금액: 485420850
    },
    {
        date: '2023-10',
        건수: 813,
        비율: 74,
        수량: 742930,
        금액: 383927820
    },
    {
        date: '2023-11',
        건수: 939,
        비율: 75,
        수량: 910755,
        금액: 453345600
    },
    {
        date: '2023-12',
        건수: 216,
        비율: 71,
        수량: 186105,
        금액: 95369460
    }
];

const config = {
    templates: {
        bar: {
            pointLabel: {
                visible: true,
                position: 'inside',
                effect: 'outline',
                numberFormat: '#,#'
            },
            xField: 'date',
            yField: '건수'
        },
        line: {
            xField: 'date',
            yField: '금액',
            yAxis: 1
        }
    },
    title: '2023년 종량제 판매 실적',
    options: {},
    xAxis: {
        type: 'time',
        tick: {
            stepInterval: '1m'
        },
        label: {
            timeFormat: 'M월'
            // autoArrange: 'none',
            // rotation: -45,
            // step: 1
        }
    },
    yAxis: [
        {
            title: '판매건수',
            label: {
                numberFormat: '#,#'
            }
        },
        {
            title: '판매금액(원)',
            tick: {
                stepInterval: 100000000
            },
            label: {
                numberSymbols: '천,백만'
            },
            position: 'opposite'
        }
    ],
    series: [
        {
            // layout: 'default',
            layout: 'stack',
            children: [
                {
                    template: 'bar',
                    name: '전화/방문',
                    data: callData
                },
                {
                    template: 'bar',
                    name: '인터넷',
                    data: internetData
                }
            ]
        },
        {
            template: 'line',
            type: 'line',
            name: '인터넷',
            color: 3,
            data: internetData
        },
        {
            template: 'line',
            type: 'line',
            name: '전화/방문',
            color: 4,
            data: callData
        }
    ]
};

let animate = false;
let chart;

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
    createCheckBox(
        container,
        'Always Animate',
        function (e) {
            animate = _getChecked(e);
        },
        false
    );
    createButton(container, 'Test', function (e) {
        alert('hello2');
    });
    createListBox(
        container,
        'options.palette',
        ['default', 'warm', 'cool', 'forest', 'gray'],
        function (e) {
            config.options.palette = _getValue(e);
            chart.load(config, animate);
        },
        'default'
    );
    createListBox(
        container,
        'layout',
        ['default', 'stack', 'fill', 'overlap'],
        function (e) {
            config.series[0].layout = _getValue(e);
            chart.load(config, animate);
        },
        'default'
    );
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
        'Series Hovering',
        function (e) {
            config.options.seriesHovering = _getChecked(e);
            chart.load(config, animate);
        },
        false
    );
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
