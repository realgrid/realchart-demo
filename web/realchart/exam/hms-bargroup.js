/**
 * @demo
 *
 */

const vaData = [
    {
        date: '2023-01',
        건수: 637,
        비율: 59,
        수량: 1067280,
        금액: 470607900
    },
    {
        date: '2023-02',
        건수: 659,
        비율: 58,
        수량: 912445,
        금액: 427773710
    },
    {
        date: '2023-03',
        건수: 730,
        비율: 58,
        수량: 1055975,
        금액: 498351580
    },
    {
        date: '2023-04',
        건수: 675,
        비율: 60,
        수량: 932765,
        금액: 438849890
    },
    {
        date: '2023-05',
        건수: 694,
        비율: 59,
        수량: 998398,
        금액: 466684600
    },
    {
        date: '2023-06',
        건수: 683,
        비율: 59,
        수량: 964357,
        금액: 442558020
    },
    {
        date: '2023-07',
        건수: 673,
        비율: 59,
        수량: 991001,
        금액: 444254730
    },
    {
        date: '2023-08',
        건수: 786,
        비율: 59,
        수량: 1120010,
        금액: 521784670
    },
    {
        date: '2023-09',
        건수: 705,
        비율: 57,
        수량: 1228031,
        금액: 555267900
    },
    {
        date: '2023-10',
        건수: 633,
        비율: 57,
        수량: 855760,
        금액: 416192470
    },
    {
        date: '2023-11',
        건수: 730,
        비율: 58,
        수량: 1063195,
        금액: 499970680
    },
    {
        date: '2023-12',
        건수: 180,
        비율: 59,
        수량: 220385,
        금액: 113747940
    }
];

const cardData = [
    {
        date: '2023-01',
        건수: 362,
        비율: 41,
        수량: 183115,
        금액: 85250760
    },
    {
        date: '2023-02',
        건수: 387,
        비율: 42,
        수량: 186030,
        금액: 95043170
    },
    {
        date: '2023-03',
        건수: 429,
        비율: 42,
        수량: 211350,
        금액: 104803670
    },
    {
        date: '2023-04',
        건수: 358,
        비율: 40,
        수량: 161135,
        금액: 81445850
    },
    {
        date: '2023-05',
        건수: 390,
        비율: 41,
        수량: 184905,
        금액: 90918790
    },
    {
        date: '2023-06',
        건수: 392,
        비율: 41,
        수량: 186775,
        금액: 90931530
    },
    {
        date: '2023-07',
        건수: 384,
        비율: 41,
        수량: 191285,
        금액: 92447580
    },
    {
        date: '2023-08',
        건수: 457,
        비율: 41,
        수량: 213665,
        금액: 112240490
    },
    {
        date: '2023-09',
        건수: 434,
        비율: 43,
        수량: 241495,
        금액: 123161380
    },
    {
        date: '2023-10',
        건수: 376,
        비율: 43,
        수량: 180555,
        금액: 101088560
    },
    {
        date: '2023-11',
        건수: 424,
        비율: 42,
        수량: 192015,
        금액: 112707170
    },
    {
        date: '2023-12',
        건수: 90,
        비율: 41,
        수량: 43650,
        금액: 21663800
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
            // reversed: true
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
                    name: '가상계좌',
                    color: '0',
                    data: vaData
                },
                {
                    template: 'bar',
                    name: '카드',
                    color: '1',
                    data: cardData
                }
            ]
        },
        {
            template: 'line',
            type: 'line',
            name: '카드',
            color: 3,
            data: cardData
        },
        {
            template: 'line',
            type: 'line',
            name: '가상계좌',
            color: 4,
            data: vaData
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
