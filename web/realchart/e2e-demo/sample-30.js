/**
 * @demo
 *
 * Bar Series 기본 예제.
 */

const categories = [
    '일반국도',
    '지방도',
    '특별광역시도',
    '시도',
    '군도',
    '고속국도',
    '기타',
];

const clearW = [18348, 11157, 70134, 56074, 6486, 4382, 11204];
const fogW = [34, 31, 11, 46, 8, 4, 10];
const snowW = [178, 76, 315, 380, 48, 37, 81];
const titleStyle = {
    alignBase: 'chart',
    style: {
        fontWeight: 700,
    },
};
const tool = {
    height: 550,
};
const config = {
    type: 'pie',
    templates: {
        title: titleStyle,
        xAxis: {
            label: {
                visible: false,
            },
        },
        annoSubtitle: {
            align: 'center',
            offsetY: 30,
            style: { fill: 'black', fontWeight: 700, fontSize: '20px' },
        },
        series: {
            pointLabel: {
                visible: true,
                textCallback: (args) => {
                    const categories = chart.xAxis.get('categories');
                    return `${categories[args.xValue]} <br>${args.yValue}%`;
                },
                visibleCallback: (args) => {
                    return args.yValue > 15;
                },
            },
            innerRadius: '20%',
            tooltipText: '${x} ${y}%',
            onPointClick: (args) => {
                const weather = args.series.name.split(' ')[1];
                const categories = chart.xAxis.get('categories');
                const index = categories[args.xValue];
                const data = [
                    {
                        도로종류: '일반국도',
                        기상상태: '맑음',
                        사고건수: 18348,
                        사망자수: 386,
                        중상자수: 5163,
                        경상자수: 21293,
                        부상신고자수: 1786,
                    },
                    {
                        도로종류: '일반국도',
                        기상상태: '흐림',
                        사고건수: 761,
                        사망자수: 27,
                        중상자수: 236,
                        경상자수: 839,
                        부상신고자수: 72,
                    },
                    {
                        도로종류: '일반국도',
                        기상상태: '비',
                        사고건수: 1100,
                        사망자수: 40,
                        중상자수: 330,
                        경상자수: 1262,
                        부상신고자수: 108,
                    },
                    {
                        도로종류: '일반국도',
                        기상상태: '안개',
                        사고건수: 34,
                        사망자수: 3,
                        중상자수: 12,
                        경상자수: 37,
                        부상신고자수: 2,
                    },
                    {
                        도로종류: '일반국도',
                        기상상태: '눈',
                        사고건수: 178,
                        사망자수: 7,
                        중상자수: 43,
                        경상자수: 201,
                        부상신고자수: 31,
                    },
                    {
                        도로종류: '일반국도',
                        기상상태: '기타/불명',
                        사고건수: 167,
                        사망자수: 5,
                        중상자수: 50,
                        경상자수: 186,
                        부상신고자수: 22,
                    },
                    {
                        도로종류: '지방도',
                        기상상태: '맑음',
                        사고건수: 11157,
                        사망자수: 278,
                        중상자수: 3489,
                        경상자수: 12105,
                        부상신고자수: 1282,
                    },
                    {
                        도로종류: '지방도',
                        기상상태: '흐림',
                        사고건수: 396,
                        사망자수: 19,
                        중상자수: 109,
                        경상자수: 408,
                        부상신고자수: 34,
                    },
                    {
                        도로종류: '지방도',
                        기상상태: '비',
                        사고건수: 554,
                        사망자수: 15,
                        중상자수: 178,
                        경상자수: 600,
                        부상신고자수: 65,
                    },
                    {
                        도로종류: '지방도',
                        기상상태: '안개',
                        사고건수: 31,
                        사망자수: 0,
                        중상자수: 20,
                        경상자수: 30,
                        부상신고자수: 2,
                    },
                    {
                        도로종류: '지방도',
                        기상상태: '눈',
                        사고건수: 76,
                        사망자수: 0,
                        중상자수: 15,
                        경상자수: 99,
                        부상신고자수: 10,
                    },
                    {
                        도로종류: '지방도',
                        기상상태: '기타/불명',
                        사고건수: 100,
                        사망자수: 4,
                        중상자수: 28,
                        경상자수: 103,
                        부상신고자수: 14,
                    },
                    {
                        도로종류: '특별광역시도',
                        기상상태: '맑음',
                        사고건수: 70134,
                        사망자수: 508,
                        중상자수: 16602,
                        경상자수: 74568,
                        부상신고자수: 5851,
                    },
                    {
                        도로종류: '특별광역시도',
                        기상상태: '흐림',
                        사고건수: 2145,
                        사망자수: 37,
                        중상자수: 539,
                        경상자수: 2265,
                        부상신고자수: 167,
                    },
                    {
                        도로종류: '특별광역시도',
                        기상상태: '비',
                        사고건수: 3693,
                        사망자수: 53,
                        중상자수: 905,
                        경상자수: 3909,
                        부상신고자수: 295,
                    },
                    {
                        도로종류: '특별광역시도',
                        기상상태: '안개',
                        사고건수: 11,
                        사망자수: 0,
                        중상자수: 2,
                        경상자수: 9,
                        부상신고자수: 2,
                    },
                    {
                        도로종류: '특별광역시도',
                        기상상태: '눈',
                        사고건수: 315,
                        사망자수: 5,
                        중상자수: 56,
                        경상자수: 372,
                        부상신고자수: 29,
                    },
                    {
                        도로종류: '특별광역시도',
                        기상상태: '기타/불명',
                        사고건수: 1064,
                        사망자수: 3,
                        중상자수: 199,
                        경상자수: 1208,
                        부상신고자수: 81,
                    },
                    {
                        도로종류: '시도',
                        기상상태: '맑음',
                        사고건수: 56074,
                        사망자수: 691,
                        중상자수: 14839,
                        경상자수: 59642,
                        부상신고자수: 4569,
                    },
                    {
                        도로종류: '시도',
                        기상상태: '흐림',
                        사고건수: 1943,
                        사망자수: 50,
                        중상자수: 534,
                        경상자수: 1963,
                        부상신고자수: 220,
                    },
                    {
                        도로종류: '시도',
                        기상상태: '비',
                        사고건수: 3007,
                        사망자수: 46,
                        중상자수: 854,
                        경상자수: 3173,
                        부상신고자수: 228,
                    },
                    {
                        도로종류: '시도',
                        기상상태: '안개',
                        사고건수: 46,
                        사망자수: 2,
                        중상자수: 16,
                        경상자수: 45,
                        부상신고자수: 3,
                    },
                    {
                        도로종류: '시도',
                        기상상태: '눈',
                        사고건수: 380,
                        사망자수: 3,
                        중상자수: 76,
                        경상자수: 440,
                        부상신고자수: 26,
                    },
                    {
                        도로종류: '시도',
                        기상상태: '기타/불명',
                        사고건수: 375,
                        사망자수: 6,
                        중상자수: 105,
                        경상자수: 403,
                        부상신고자수: 25,
                    },
                    {
                        도로종류: '군도',
                        기상상태: '맑음',
                        사고건수: 6486,
                        사망자수: 200,
                        중상자수: 2494,
                        경상자수: 6102,
                        부상신고자수: 554,
                    },
                    {
                        도로종류: '군도',
                        기상상태: '흐림',
                        사고건수: 251,
                        사망자수: 10,
                        중상자수: 91,
                        경상자수: 225,
                        부상신고자수: 28,
                    },
                    {
                        도로종류: '군도',
                        기상상태: '비',
                        사고건수: 274,
                        사망자수: 13,
                        중상자수: 109,
                        경상자수: 289,
                        부상신고자수: 24,
                    },
                    {
                        도로종류: '군도',
                        기상상태: '안개',
                        사고건수: 8,
                        사망자수: 3,
                        중상자수: 3,
                        경상자수: 5,
                        부상신고자수: 1,
                    },
                    {
                        도로종류: '군도',
                        기상상태: '눈',
                        사고건수: 48,
                        사망자수: 3,
                        중상자수: 17,
                        경상자수: 59,
                        부상신고자수: 4,
                    },
                    {
                        도로종류: '군도',
                        기상상태: '기타/불명',
                        사고건수: 16,
                        사망자수: 1,
                        중상자수: 8,
                        경상자수: 14,
                        부상신고자수: 2,
                    },
                    {
                        도로종류: '고속국도',
                        기상상태: '맑음',
                        사고건수: 4382,
                        사망자수: 152,
                        중상자수: 1259,
                        경상자수: 7260,
                        부상신고자수: 782,
                    },
                    {
                        도로종류: '고속국도',
                        기상상태: '흐림',
                        사고건수: 90,
                        사망자수: 9,
                        중상자수: 35,
                        경상자수: 115,
                        부상신고자수: 7,
                    },
                    {
                        도로종류: '고속국도',
                        기상상태: '비',
                        사고건수: 325,
                        사망자수: 19,
                        중상자수: 134,
                        경상자수: 472,
                        부상신고자수: 62,
                    },
                    {
                        도로종류: '고속국도',
                        기상상태: '안개',
                        사고건수: 4,
                        사망자수: 0,
                        중상자수: 2,
                        경상자수: 2,
                        부상신고자수: 1,
                    },
                    {
                        도로종류: '고속국도',
                        기상상태: '눈',
                        사고건수: 37,
                        사망자수: 1,
                        중상자수: 32,
                        경상자수: 122,
                        부상신고자수: 0,
                    },
                    {
                        도로종류: '고속국도',
                        기상상태: '기타/불명',
                        사고건수: 22,
                        사망자수: 3,
                        중상자수: 6,
                        경상자수: 23,
                        부상신고자수: 1,
                    },
                    {
                        도로종류: '기타',
                        기상상태: '맑음',
                        사고건수: 11204,
                        사망자수: 102,
                        중상자수: 2794,
                        경상자수: 10909,
                        부상신고자수: 1084,
                    },
                    {
                        도로종류: '기타',
                        기상상태: '흐림',
                        사고건수: 432,
                        사망자수: 10,
                        중상자수: 95,
                        경상자수: 407,
                        부상신고자수: 54,
                    },
                    {
                        도로종류: '기타',
                        기상상태: '비',
                        사고건수: 540,
                        사망자수: 8,
                        중상자수: 116,
                        경상자수: 566,
                        부상신고자수: 56,
                    },
                    {
                        도로종류: '기타',
                        기상상태: '안개',
                        사고건수: 10,
                        사망자수: 1,
                        중상자수: 3,
                        경상자수: 6,
                        부상신고자수: 1,
                    },
                    {
                        도로종류: '기타',
                        기상상태: '눈',
                        사고건수: 81,
                        사망자수: 2,
                        중상자수: 12,
                        경상자수: 111,
                        부상신고자수: 12,
                    },
                    {
                        도로종류: '기타',
                        기상상태: '기타/불명',
                        사고건수: 537,
                        사망자수: 10,
                        중상자수: 105,
                        경상자수: 583,
                        부상신고자수: 61,
                    },
                ];
                const datas = data.filter((d) => {
                    return d['기상상태'] === weather && d['도로종류'] === index;
                });
                const detailData = [
                    {
                        name: '사망자수',
                        y: datas[0].사망자수,
                    },
                    {
                        name: '중상자수',
                        y: datas[0].중상자수,
                    },
                    {
                        name: '경상자수',
                        y: datas[0].경상자수,
                    },
                ];
                const detail = {
                    title: {
                        alignBase: 'chart',
                        style: {
                            fontWeight: 700,
                        },
                        text: `[${weather}] ${index} 사고 (${datas[0].사고건수}건)`,
                    },
                    options: {
                        // animatable: false,
                    },
                    legend: {
                        location: 'bottom',
                    },
                    series: {
                        type: 'pie',
                        totalAngle: 180,
                        startAngle: 270,
                        legendByPoint: true,
                        innerRadius: '40%',
                        radius: '60%',
                        centerY: '80%',
                        tooltipText: '${x}, ${y}건',
                        pointLabel: {
                            visible: true,
                            position: 'outside',
                            distance: 30,
                            text: '${x}, ${y}건',
                            style: {},
                            visibleCallback: (args) => {
                                return args.yValue !== 0;
                            },
                        },
                        onPointClick: (args) => {
                            chart.load(config, true);
                        },
                        data: detailData,
                    },
                };
                // detail.series.data = detailData;
                // detail.title.text = `[${weather}] ${index} 사고 (${datas[0].사고건수}건)`;

                chart.load(detail, true);
            },
        },
    },
    title: {
        template: 'title',
        text: '기상상태에 따른 도로종류별 사고건수 현황',
    },
    split: {
        size: 1,
        visible: true,
        cols: 3,
        panes: [
            {
                body: {
                    annotations: [
                        {
                            template: 'annoSubtitle',
                            text: '날씨: 맑음',
                        },
                    ],
                },
            },
            {
                col: 1,
                body: {
                    annotations: [
                        {
                            template: 'annoSubtitle',
                            text: '날씨: 안개',
                        },
                    ],
                },
            },
            {
                col: 2,
                body: {
                    annotations: [
                        {
                            template: 'annoSubtitle',
                            text: '날씨: 눈',
                        },
                    ],
                },
            },
        ],
    },
    xAxis: [
        {
            template: 'xAxis',
            categories: categories,
        },
        {
            col: 1,
            template: 'xAxis',
            categories: categories,
        },
        {
            col: 2,
            template: 'xAxis',
            categories: categories,
        },
    ],
    yAxis: {
        label: {
            visible: false,
        },
    },
    series: [
        {
            template: 'series',
            name: '날씨: 맑음',
            data: clearW.map((x) =>
                Number(
                    (
                        (x / clearW.reduce((acc, val) => acc + val, 0)) *
                        100
                    ).toFixed(2)
                )
            ),
        },
        {
            xAxis: 1,
            name: '날씨: 안개',
            template: 'series',
            data: fogW.map((x) =>
                Number(
                    (
                        (x / fogW.reduce((acc, val) => acc + val, 0)) *
                        100
                    ).toFixed(2)
                )
            ),
        },
        {
            xAxis: 2,
            name: '날씨: 눈',
            template: 'series',
            data: snowW.map((x) =>
                Number(
                    (
                        (x / snowW.reduce((acc, val) => acc + val, 0)) *
                        100
                    ).toFixed(2)
                )
            ),
        },
    ],
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
        alert('hello');
    });
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
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
