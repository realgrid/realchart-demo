/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const data = [
    {
        year: '2013-01',
        japan: 6941,
        china: 51606,
        hongkong: 681,
        taiwan: 2106,
        vietnam: 422,
        america: 433
    },
    {
        year: '2013-02',
        japan: 5702,
        china: 77252,
        hongkong: 2502,
        taiwan: 2700,
        vietnam: 1551,
        america: 465
    },
    {
        year: '2013-03',
        japan: 11568,
        china: 73007,
        hongkong: 3589,
        taiwan: 2898,
        vietnam: 1163,
        america: 979
    },
    {
        year: '2013-04',
        japan: 11720,
        china: 141793,
        hongkong: 4688,
        taiwan: 2798,
        vietnam: 2469,
        america: 2405
    },
    {
        year: '2013-05',
        japan: 22520,
        china: 115104,
        hongkong: 3062,
        taiwan: 5089,
        vietnam: 1023,
        america: 2501
    },
    {
        year: '2013-06',
        japan: 10271,
        china: 183838,
        hongkong: 5077,
        taiwan: 5958,
        vietnam: 1678,
        america: 3639
    },
    {
        year: '2013-07',
        japan: 9847,
        china: 307406,
        hongkong: 4304,
        taiwan: 3387,
        vietnam: 2186,
        america: 2509
    },
    {
        year: '2013-08',
        japan: 11292,
        china: 350458,
        hongkong: 3188,
        taiwan: 4056,
        vietnam: 1910,
        america: 1865
    },
    {
        year: '2013-09',
        japan: 12111,
        china: 222443,
        hongkong: 3824,
        taiwan: 2964,
        vietnam: 11097,
        america: 1761
    },
    {
        year: '2013-10',
        japan: 13559,
        china: 141087,
        hongkong: 4477,
        taiwan: 3480,
        vietnam: 2197,
        america: 4002
    },
    {
        year: '2013-11',
        japan: 7608,
        china: 81010,
        hongkong: 2723,
        taiwan: 2097,
        vietnam: 1567,
        america: 542
    },
    {
        year: '2013-12',
        japan: 5740,
        china: 67168,
        hongkong: 1646,
        taiwan: 1357,
        vietnam: 899,
        america: 338
    },
    {
        year: '2014-01',
        japan: 5022,
        china: 83987,
        hongkong: 692,
        taiwan: 1740,
        vietnam: 172,
        america: 281
    },
    {
        year: '2014-02',
        japan: 5231,
        china: 110010,
        hongkong: 1758,
        taiwan: 1692,
        vietnam: 2640,
        america: 856
    },
    {
        year: '2014-03',
        japan: 7985,
        china: 140849,
        hongkong: 2402,
        taiwan: 1837,
        vietnam: 1896,
        america: 1162
    },
    {
        year: '2014-04',
        japan: 12671,
        china: 245106,
        hongkong: 3653,
        taiwan: 2530,
        vietnam: 5088,
        america: 2661
    },
    {
        year: '2014-05',
        japan: 14355,
        china: 240811,
        hongkong: 2943,
        taiwan: 3225,
        vietnam: 4057,
        america: 1720
    },
    {
        year: '2014-06',
        japan: 8774,
        china: 288996,
        hongkong: 2764,
        taiwan: 3550,
        vietnam: 2290,
        america: 1822
    },
    {
        year: '2014-07',
        japan: 6373,
        china: 388694,
        hongkong: 2111,
        taiwan: 3570,
        vietnam: 3492,
        america: 1694
    },
    {
        year: '2014-08',
        japan: 7577,
        china: 450359,
        hongkong: 2722,
        taiwan: 3849,
        vietnam: 2141,
        america: 1564
    },
    {
        year: '2014-09',
        japan: 8705,
        china: 306732,
        hongkong: 2543,
        taiwan: 2872,
        vietnam: 1690,
        america: 1798
    },
    {
        year: '2014-10',
        japan: 8816,
        china: 282994,
        hongkong: 3167,
        taiwan: 3385,
        vietnam: 3541,
        america: 4855
    },
    {
        year: '2014-11',
        japan: 7754,
        china: 178025,
        hongkong: 2318,
        taiwan: 2455,
        vietnam: 2957,
        america: 818
    },
    {
        year: '2014-12',
        japan: 3256,
        china: 142529,
        hongkong: 1332,
        taiwan: 1484,
        vietnam: 1950,
        america: 581
    },
    {
        year: '2015-01',
        japan: 3749,
        china: 117179,
        hongkong: 554,
        taiwan: 1061,
        vietnam: 593,
        america: 315
    },
    {
        year: '2015-02',
        japan: 3855,
        china: 198196,
        hongkong: 906,
        taiwan: 1231,
        vietnam: 952,
        america: 400
    },
    {
        year: '2015-03',
        japan: 5651,
        china: 172100,
        hongkong: 3186,
        taiwan: 831,
        vietnam: 4437,
        america: 857
    },
    {
        year: '2015-04',
        japan: 7663,
        china: 261695,
        hongkong: 3686,
        taiwan: 3609,
        vietnam: 7846,
        america: 2907
    },
    {
        year: '2015-05',
        japan: 14641,
        china: 256818,
        hongkong: 2188,
        taiwan: 1804,
        vietnam: 2602,
        america: 2497
    },
    {
        year: '2015-06',
        japan: 3760,
        china: 155953,
        hongkong: 1419,
        taiwan: 1096,
        vietnam: 1412,
        america: 1736
    },
    {
        year: '2015-07',
        japan: 1650,
        china: 65977,
        hongkong: 329,
        taiwan: 169,
        vietnam: 651,
        america: 1235
    },
    {
        year: '2015-08',
        japan: 7037,
        china: 191959,
        hongkong: 925,
        taiwan: 348,
        vietnam: 832,
        america: 1252
    },
    {
        year: '2015-09',
        japan: 4685,
        china: 233383,
        hongkong: 4530,
        taiwan: 1784,
        vietnam: 1007,
        america: 1866
    },
    {
        year: '2015-10',
        japan: 3109,
        china: 268591,
        hongkong: 2154,
        taiwan: 2088,
        vietnam: 2724,
        america: 1807
    },
    {
        year: '2015-11',
        japan: 1662,
        china: 174677,
        hongkong: 1598,
        taiwan: 2022,
        vietnam: 2854,
        america: 1057
    },
    {
        year: '2015-12',
        japan: 1771,
        china: 140835,
        hongkong: 1257,
        taiwan: 1796,
        vietnam: 896,
        america: 969
    },
    {
        year: '2016-01',
        japan: 1646,
        china: 142133,
        hongkong: 646,
        taiwan: 1927,
        vietnam: 770,
        america: 779
    },
    {
        year: '2016-02',
        japan: 1942,
        china: 190761,
        hongkong: 1115,
        taiwan: 2142,
        vietnam: 3069,
        america: 1389
    },
    {
        year: '2016-03',
        japan: 3471,
        china: 199952,
        hongkong: 2257,
        taiwan: 1874,
        vietnam: 2739,
        america: 2415
    },
    {
        year: '2016-04',
        japan: 5479,
        china: 244440,
        hongkong: 4241,
        taiwan: 2874,
        vietnam: 3457,
        america: 3780
    },
    {
        year: '2016-05',
        japan: 7885,
        china: 301570,
        hongkong: 3961,
        taiwan: 2711,
        vietnam: 1641,
        america: 2076
    },
    {
        year: '2016-06',
        japan: 3854,
        china: 330235,
        hongkong: 3688,
        taiwan: 3815,
        vietnam: 1890,
        america: 2716
    },
    {
        year: '2016-07',
        japan: 4131,
        china: 356436,
        hongkong: 3988,
        taiwan: 4440,
        vietnam: 2589,
        america: 3136
    },
    {
        year: '2016-08',
        japan: 4539,
        china: 393479,
        hongkong: 5307,
        taiwan: 4765,
        vietnam: 1411,
        america: 4086
    },
    {
        year: '2016-09',
        japan: 4032,
        china: 276431,
        hongkong: 4278,
        taiwan: 4778,
        vietnam: 1888,
        america: 4750
    },
    {
        year: '2016-10',
        japan: 5751,
        china: 272842,
        hongkong: 7955,
        taiwan: 4750,
        vietnam: 2184,
        america: 4922
    },
    {
        year: '2016-11',
        japan: 3291,
        china: 184371,
        hongkong: 3885,
        taiwan: 2253,
        vietnam: 1673,
        america: 1883
    },
    {
        year: '2016-12',
        japan: 2006,
        china: 168872,
        hongkong: 3436,
        taiwan: 1717,
        vietnam: 1697,
        america: 2010
    },
    {
        year: '2017-01',
        japan: 1905,
        china: 184306,
        hongkong: 3109,
        taiwan: 1450,
        vietnam: 1220,
        america: 1993
    },
    {
        year: '2017-02',
        japan: 1816,
        china: 180094,
        hongkong: 3058,
        taiwan: 1421,
        vietnam: 981,
        america: 1762
    },
    {
        year: '2017-03',
        japan: 2940,
        china: 87669,
        hongkong: 2609,
        taiwan: 1259,
        vietnam: 1447,
        america: 3178
    },
    {
        year: '2017-04',
        japan: 4119,
        china: 28988,
        hongkong: 6066,
        taiwan: 2141,
        vietnam: 2925,
        america: 4903
    },
    {
        year: '2017-05',
        japan: 3652,
        china: 31382,
        hongkong: 4959,
        taiwan: 2069,
        vietnam: 2306,
        america: 3785
    },
    {
        year: '2017-06',
        japan: 6709,
        china: 33184,
        hongkong: 5519,
        taiwan: 3103,
        vietnam: 2666,
        america: 3097
    },
    {
        year: '2017-07',
        japan: 4894,
        china: 40825,
        hongkong: 6532,
        taiwan: 3384,
        vietnam: 4061,
        america: 3923
    },
    {
        year: '2017-08',
        japan: 7768,
        china: 38560,
        hongkong: 5247,
        taiwan: 3711,
        vietnam: 1490,
        america: 2534
    },
    {
        year: '2017-09',
        japan: 6710,
        china: 30753,
        hongkong: 4344,
        taiwan: 3256,
        vietnam: 1769,
        america: 2386
    },
    {
        year: '2017-10',
        japan: 5659,
        china: 32175,
        hongkong: 3919,
        taiwan: 3115,
        vietnam: 3171,
        america: 2437
    },
    {
        year: '2017-11',
        japan: 6222,
        china: 28329,
        hongkong: 2061,
        taiwan: 2254,
        vietnam: 1213,
        america: 1406
    },
    {
        year: '2017-12',
        japan: 2965,
        china: 31050,
        hongkong: 1529,
        taiwan: 1831,
        vietnam: 1057,
        america: 1247
    },
    {
        year: '2018-01',
        japan: 3229,
        china: 30131,
        hongkong: 1298,
        taiwan: 1912,
        vietnam: 1100,
        america: 848
    },
    {
        year: '2018-02',
        japan: 3045,
        china: 32782,
        hongkong: 1468,
        taiwan: 2485,
        vietnam: 722,
        america: 870
    },
    {
        year: '2018-03',
        japan: 5311,
        china: 42243,
        hongkong: 2721,
        taiwan: 3279,
        vietnam: 1806,
        america: 2067
    },
    {
        year: '2018-04',
        japan: 5984,
        china: 44257,
        hongkong: 4146,
        taiwan: 2971,
        vietnam: 3683,
        america: 2056
    },
    {
        year: '2018-05',
        japan: 7576,
        china: 50010,
        hongkong: 3843,
        taiwan: 3567,
        vietnam: 2123,
        america: 1582
    },
    {
        year: '2018-06',
        japan: 8664,
        china: 57754,
        hongkong: 7080,
        taiwan: 5290,
        vietnam: 3061,
        america: 2620
    },
    {
        year: '2018-07',
        japan: 9145,
        china: 65723,
        hongkong: 4910,
        taiwan: 4374,
        vietnam: 3405,
        america: 3049
    },
    {
        year: '2018-08',
        japan: 11084,
        china: 78485,
        hongkong: 6192,
        taiwan: 6354,
        vietnam: 3633,
        america: 3046
    },
    {
        year: '2018-09',
        japan: 7660,
        china: 70124,
        hongkong: 4985,
        taiwan: 4296,
        vietnam: 2305,
        america: 4151
    },
    {
        year: '2018-10',
        japan: 10075,
        china: 72022,
        hongkong: 4916,
        taiwan: 5589,
        vietnam: 2952,
        america: 4624
    },
    {
        year: '2018-11',
        japan: 9218,
        china: 58883,
        hongkong: 4468,
        taiwan: 5628,
        vietnam: 2820,
        america: 3546
    },
    {
        year: '2018-12',
        japan: 5643,
        china: 63706,
        hongkong: 3058,
        taiwan: 5596,
        vietnam: 2623,
        america: 2811
    },
    {
        year: '2019-01',
        japan: 5145,
        china: 61889,
        hongkong: 2544,
        taiwan: 5383,
        vietnam: 2732,
        america: 2974
    },
    {
        year: '2019-02',
        japan: 4229,
        china: 69351,
        hongkong: 2906,
        taiwan: 5449,
        vietnam: 2469,
        america: 3051
    },
    {
        year: '2019-03',
        japan: 6109,
        china: 73532,
        hongkong: 3879,
        taiwan: 6877,
        vietnam: 2366,
        america: 2771
    },
    {
        year: '2019-04',
        japan: 6751,
        china: 72420,
        hongkong: 5509,
        taiwan: 10263,
        vietnam: 3135,
        america: 5769
    },
    {
        year: '2019-05',
        japan: 9658,
        china: 84333,
        hongkong: 5557,
        taiwan: 9695,
        vietnam: 2169,
        america: 4337
    },
    {
        year: '2019-06',
        japan: 10574,
        china: 94834,
        hongkong: 5632,
        taiwan: 6573,
        vietnam: 3098,
        america: 2498
    },
    {
        year: '2019-07',
        japan: 8475,
        china: 102692,
        hongkong: 5357,
        taiwan: 8919,
        vietnam: 1849,
        america: 2851
    },
    {
        year: '2019-08',
        japan: 12213,
        china: 120043,
        hongkong: 5696,
        taiwan: 8250,
        vietnam: 1827,
        america: 2996
    },
    {
        year: '2019-09',
        japan: 8024,
        china: 100439,
        hongkong: 4566,
        taiwan: 6500,
        vietnam: 1542,
        america: 2781
    },
    {
        year: '2019-10',
        japan: 7425,
        china: 108798,
        hongkong: 4907,
        taiwan: 8195,
        vietnam: 3238,
        america: 3866
    },
    {
        year: '2019-11',
        japan: 4403,
        china: 96425,
        hongkong: 4019,
        taiwan: 5434,
        vietnam: 2295,
        america: 3332
    },
    {
        year: '2019-12',
        japan: 4969,
        china: 94377,
        hongkong: 5696,
        taiwan: 6443,
        vietnam: 2158,
        america: 2601
    },
    {
        year: '2020-01',
        japan: null,
        china: null,
        hongkong: null,
        taiwan: null,
        vietnam: null,
        america: null
    },
    {
        year: '2020-02',
        japan: null,
        china: null,
        hongkong: null,
        taiwan: null,
        vietnam: null,
        america: null
    },
    {
        year: '2020-03',
        japan: null,
        china: null,
        hongkong: null,
        taiwan: null,
        vietnam: null,
        america: null
    },
    {
        year: '2020-04',
        japan: null,
        china: null,
        hongkong: null,
        taiwan: null,
        vietnam: null,
        america: null
    },
    {
        year: '2020-05',
        japan: null,
        china: null,
        hongkong: null,
        taiwan: null,
        vietnam: null,
        america: null
    },
    {
        year: '2020-06',
        japan: null,
        china: null,
        hongkong: null,
        taiwan: null,
        vietnam: null,
        america: null
    },
    {
        year: '2020-07',
        japan: null,
        china: null,
        hongkong: null,
        taiwan: null,
        vietnam: null,
        america: null
    },
    {
        year: '2020-08',
        japan: null,
        china: null,
        hongkong: null,
        taiwan: null,
        vietnam: null,
        america: null
    },
    {
        year: '2020-09',
        japan: null,
        china: null,
        hongkong: null,
        taiwan: null,
        vietnam: null,
        america: null
    },
    {
        year: '2020-10',
        japan: null,
        china: null,
        hongkong: null,
        taiwan: null,
        vietnam: null,
        america: null
    },
    {
        year: '2020-11',
        japan: null,
        china: null,
        hongkong: null,
        taiwan: null,
        vietnam: null,
        america: null
    },
    {
        year: '2020-12',
        japan: null,
        china: null,
        hongkong: null,
        taiwan: null,
        vietnam: null,
        america: null
    },
    {
        year: '2021-01',
        japan: 28,
        china: 418,
        hongkong: 18,
        taiwan: 24,
        vietnam: 11,
        america: 411
    },
    {
        year: '2021-02',
        japan: 51,
        china: 440,
        hongkong: 17,
        taiwan: 28,
        vietnam: 21,
        america: 564
    },
    {
        year: '2021-03',
        japan: 70,
        china: 783,
        hongkong: 10,
        taiwan: 25,
        vietnam: 35,
        america: 830
    },
    {
        year: '2021-04',
        japan: 75,
        china: 706,
        hongkong: 25,
        taiwan: 22,
        vietnam: 64,
        america: 771
    },
    {
        year: '2021-05',
        japan: 82,
        china: 770,
        hongkong: 21,
        taiwan: 41,
        vietnam: 26,
        america: 911
    },
    {
        year: '2021-06',
        japan: 97,
        china: 481,
        hongkong: 33,
        taiwan: 20,
        vietnam: 63,
        america: 1043
    },
    {
        year: '2021-07',
        japan: 99,
        china: 463,
        hongkong: 26,
        taiwan: 25,
        vietnam: 74,
        america: 1161
    },
    {
        year: '2021-08',
        japan: 85,
        china: 499,
        hongkong: 30,
        taiwan: 42,
        vietnam: 86,
        america: 905
    },
    {
        year: '2021-09',
        japan: 84,
        china: 487,
        hongkong: 1,
        taiwan: 15,
        vietnam: 79,
        america: 1279
    },
    {
        year: '2021-10',
        japan: 88,
        china: 446,
        hongkong: 8,
        taiwan: 20,
        vietnam: 58,
        america: 922
    },
    {
        year: '2021-11',
        japan: 141,
        china: 448,
        hongkong: 2,
        taiwan: 21,
        vietnam: 73,
        america: 1090
    },
    {
        year: '2021-12',
        japan: 72,
        china: 440,
        hongkong: 0,
        taiwan: 21,
        vietnam: 24,
        america: 859
    },
    {
        year: '2022-01',
        japan: 116,
        china: 450,
        hongkong: 5,
        taiwan: 12,
        vietnam: 34,
        america: 887
    },
    {
        year: '2022-02',
        japan: 85,
        china: 367,
        hongkong: 7,
        taiwan: 17,
        vietnam: 28,
        america: 714
    },
    {
        year: '2022-03',
        japan: 85,
        china: 372,
        hongkong: 20,
        taiwan: 13,
        vietnam: 44,
        america: 757
    },
    {
        year: '2022-04',
        japan: 103,
        china: 431,
        hongkong: 7,
        taiwan: 8,
        vietnam: 29,
        america: 867
    },
    {
        year: '2022-05',
        japan: 175,
        china: 525,
        hongkong: 34,
        taiwan: 43,
        vietnam: 60,
        america: 1082
    },
    {
        year: '2022-06',
        japan: 134,
        china: 628,
        hongkong: 112,
        taiwan: 110,
        vietnam: 79,
        america: 1087
    },
    {
        year: '2022-07',
        japan: 138,
        china: 963,
        hongkong: 78,
        taiwan: 114,
        vietnam: 139,
        america: 1140
    },
    {
        year: '2022-08',
        japan: 240,
        china: 1072,
        hongkong: 52,
        taiwan: 64,
        vietnam: 135,
        america: 1122
    },
    {
        year: '2022-09',
        japan: 234,
        china: 1257,
        hongkong: 63,
        taiwan: 89,
        vietnam: 86,
        america: 1359
    },
    {
        year: '2022-10',
        japan: 244,
        china: 1385,
        hongkong: 119,
        taiwan: 130,
        vietnam: 162,
        america: 1466
    },
    {
        year: '2022-11',
        japan: 1018,
        china: 1104,
        hongkong: 518,
        taiwan: 415,
        vietnam: 455,
        america: 1221
    },
    {
        year: '2022-12',
        japan: 641,
        china: 1337,
        hongkong: 520,
        taiwan: 1631,
        vietnam: 73,
        america: 685
    }
];
const getSum = (d) => {
    return d.china + d.japan + d.hongkong + d.taiwan + d.vietnam + d.america;
};
const config = {
    type: 'area',
    title: '연도별 제주도 외국인 관광객 현황',
    templates: {
        series: {
            marker: {
                visible: false
            },
            lineType: 'spline',
            connectNullPoints: true
        }
    },
    xAxis: {
        type: 'time'

        // break: { from: 1577836800000, to: 1606780800000 },
    },
    yAxis: {
        label: { suffix: ' %' },
        // position: "opposite",
        // strictMin: 0,
        // strictMax: 100,
        label: {
            suffix: '%'
        },
        tick: {
            //   stepInterval: 20,
        }
    },
    series: [
        {
            layout: 'fill',
            children: [
                {
                    template: 'series',
                    name: '홍콩',
                    // data: data.map((d) => d.hongkong),
                    data: data,
                    xField: 'year',
                    yField: 'hongkong'
                },
                {
                    template: 'series',
                    name: '베트남',
                    // data: data.map((d) => d.vietnam),
                    data: data,
                    xField: 'year',
                    yField: 'vietnam'
                },
                {
                    template: 'series',
                    name: '대만',
                    // data: data.map((d) => d.taiwan),
                    data: data,
                    xField: 'year',
                    yField: 'taiwan'
                },
                {
                    template: 'series',
                    name: '미국',
                    // data: data.map((d) => d.america),
                    data: data,
                    xField: 'year',
                    yField: 'america'
                },
                {
                    template: 'series',
                    name: '일본',
                    // data: data.map((d) => d.japan),
                    data: data,
                    xField: 'year',
                    yField: 'japan'
                }
            ]
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
