/**
 * @demo
 * 
 */
const config = {
    title: "Treemap - Levels",
    xAxis: {
    },
    yAxis: {
    },
    series: {
        type: 'treemap',
        algorithm: 'squarify',
        pointLabel: {
            visibleCallback: (args) => {
                if(args.yValue < 3){
                    return ""
                }
                return args.yValue
            },
            text: '${x}',
            effect: 'outline',
            style: {
            },
        },
        data: [{
            "id": "A",
            "name": "A",
            "color": "#50FFB1"
        }, 
        {
            "id": "B",
            "name": "B",
            "color": "#F5FBEF"
        }, {
            "id": "C",
            "name": "C",
            "color": "#A09FA8"
        }, 
        {
            'id': 'A-1',
            "name": "A-1",
            "group": "A",
            'color': '#FF0000'
        },{
            "name": "A-1-1",
            "group": "A-1",
            'value': 6.84
        },{
            "name": "A-1-2",
            "group": "A-1",
            'value': 5.85
        },{
            "name": "A-1-3",
            "group": "A-1",
            'value': 5.01
        },{
            "name": "A-1-4",
            "group": "A-1",
            'value': 4.45
        },{
            "name": "A-1-5",
            "group": "A-1",
            'value': 3.86
        },{
            "name": "A-1-6",
            "group": "A-1",
            'value': 3.67
        },{
            "name": "A-1-7",
            "group": "A-1",
            'value': 3.56
        },{
            "name": "A-1-8",
            "group": "A-1",
            'value': 3.45
        },{
            "name": "A-1-9",
            "group": "A-1",
            'value': 2.42
        },{
            "name": "A-1-10",
            "group": "A-1",
            'value': 3.5
        },{
            "name": "A-1-11",
            "group": "A-1",
            'value': 2.35
        },{
            "name": "A-1-12",
            "group": "A-1",
            'value': 1.91
        },{
            "name": "A-1-13",
            "group": "A-1",
            'value': 1.88
        },{
            "name": "A-1-14",
            "group": "A-1",
            'value': 1.84
        },{
            "name": "A-1-15",
            "group": "A-1",
            'value': 1.82
        },{
            "name": "A-1-16",
            "group": "A-1",
            'value': 3.06
        },{
            "name": "A-1-17",
            "group": "A-1",
            'value': 2.27
        },{
            "name": "A-1-18",
            "group": "A-1",
            'value': 2.05
        },{
            "name": "A-1-19",
            "group": "A-1",
            'value': 1.91
        },{
            "name": "A-1-20",
            "group": "A-1",
            'value': 1.88
        },{
            "name": "A-1-21",
            "group": "A-1",
            'value': 1.64
        },{
            "name": "A-1-22",
            "group": "A-1",
            'value': 1.48
        },{
            "name": "A-1-23",
            "group": "A-1",
            'value': 1.44
        },{
            "name": "A-1-24",
            "group": "A-1",
            'value': 1.43
        },{
            "name": "A-1-25",
            "group": "A-1",
            'value': 1.34
        },{
            "name": "A-1-26",
            "group": "A-1",
            'value': 1.33
        },{
            "name": "A-1-27",
            "group": "A-1",
            'value': 1.32
        },{
            "name": "A-1-28",
            "group": "A-1",
            'value': 1.30
        },{
            "name": "A-1-29",
            "group": "A-1",
            'value': 1.29
        },{
            "name": "A-1-30",
            "group": "A-1",
            'value': 1.28
        },{
            "name": "A-1-31",
            "group": "A-1",
            'value': 1.27
        },{
            "name": "A-1-32",
            "group": "A-1",
            'value': 1.24
        },{
            "name": "A-1-33",
            "group": "A-1",
            'value': 1.23
        },{
            "name": "A-1-34",
            "group": "A-1",
            'value': 1.22
        },{
            "name": "A-1-35",
            "group": "A-1",
            'value': 1.21
        },{
            "name": "A-1-36",
            "group": "A-1",
            'value': 0.20
        },{
            "name": "A-1-37",
            "group": "A-1",
            'value': 0.19
        },{
            "name": "A-1-38",
            "group": "A-1",
            'value': 0.18
        },{
            "name": "A-1-39",
            "group": "A-1",
            'value': 0.17
        },{
            "name": "A-1-40",
            "group": "A-1",
            'value': 0.16
        },{
            "name": "A-1-41",
            "group": "A-1",
            'value': 0.15
        },{
            "name": "A-1-42",
            "group": "A-1",
            'value': 0.14
        },{
            "name": "A-1-43",
            "group": "A-1",
            'value': 0.13
        },{
            "name": "A-1-44",
            "group": "A-1",
            'value': 0.12
        },{
            "name": "A-1-45",
            "group": "A-1",
            'value': 0.11
        },{
            "name": "A-1-46",
            "group": "A-1",
            'value': 0.09
        },{
            "name": "A-1-47",
            "group": "A-1",
            'value': 0.08
        },{
            "name": "A-1-48",
            "group": "A-1",
            'value': 0.07
        },{
            "name": "A-1-49",
            "group": "A-1",
            'value': 0.06
        },{
            "name": "A-1-50",
            "group": "A-1",
            'value': 0.05
        },{
            "name": "A-1-51",
            "group": "A-1",
            'value': 0.04
        },{
            "name": "A-1-52",
            "group": "A-1",
            'value': 0.03
        },{
            "name": "A-1-53",
            "group": "A-1",
            'value': 0.02
        },{
            "name": "A-1-54",
            "group": "A-1",
            'value': 0.01
        },{
            "name": "A-1-55",
            "group": "A-1",
            'value': 0.001
        },{
            "name": "A-1-56",
            "group": "A-1",
            'value': 0.002
        },{
            "name": "A-1-57",
            "group": "A-1",
            'value': 0.003
        },{
            "name": "A-1-58",
            "group": "A-1",
            'value': 0.004
        },{
            "name": "A-1-59",
            "group": "A-1",
            'value': 0.005
        },{
            "name": "A-1-60",
            "group": "A-1",
            'value': 0.006
        },{
            "name": "A-1-61",
            "group": "A-1",
            'value': 0.007
        },{
            "name": "A-1-62",
            "group": "A-1",
            'value': 0.008
        },{
            "name": "A-1-63",
            "group": "A-1",
            'value': 0.009
        },{
            "name": "A-1-64",
            "group": "A-1",
            'value': 0.0001
        },{
            "name": "A-1-65",
            "group": "A-1",
            'value': 0.0002
        },{
            "name": "A-1-66",
            "group": "A-1",
            'value': 0.0024
        },{
            "name": "A-1-67",
            "group": "A-1",
            'value': 0.00275
        },{
            "name": "A-1-68",
            "group": "A-1",
            'value': 0.2766
        },{
            "name": "A-1-69",
            "group": "A-1",
            'value': 0.27544
        },{
            "name": "A-1-70",
            "group": "A-1",
            'value': 0.27543
        },{
            "name": "A-1-71",
            "group": "A-1",
            'value': 0.2654
        },{
            "name": "A-1-72",
            "group": "A-1",
            'value': 0.2653
        },{
            "name": "A-1-73",
            "group": "A-1",
            'value': 0.2622
        },{
            "name": "A-1-74",
            "group": "A-1",
            'value': 0.2522
        },{
            "name": "A-1-75",
            "group": "A-1",
            'value': 0.2321
        },{
            "name": "A-1-76",
            "group": "A-1",
            'value': 0.2211
        },{
            "name": "A-1-77",
            "group": "A-1",
            'value': 0.22984
        },{
            "name": "A-1-78",
            "group": "A-1",
            'value': 0.2313
        },{
            "name": "A-1-79",
            "group": "A-1",
            'value': 0.2111
        },{
            "name": "A-1-80",
            "group": "A-1",
            'value': 0.20313
        },{
            "name": "A-1-81",
            "group": "A-1",
            'value': 0.20311
        },{
            "name": "A-1-82",
            "group": "A-1",
            'value': 0.20032
        },{
            "name": "A-1-83",
            "group": "A-1",
            'value': 0.200311
        },{
            "name": "A-1-84",
            "group": "A-1",
            'value': 0.20111
        },{
            "name": "A-1-85",
            "group": "A-1",
            'value': 0.20331
        },
        {
            "id": "B-1",
            "name": "B-1",
            "group": "B",
        }, {
            'id': 'B-1-1',
            "name": "B-1-1",
            "group": "B-1",
            'color': '#FFA500'
        }, {
            "name": "B-1-1-1",
            "group": "B-1-1",
            'value': 18
        }, {
            "name": "B-1-1-2",
            "group": "B-1-1",
            'value': 1
        }, {
            "name": "B-1-1-3",
            "group": "B-1-1",
            'value': 2.9
        }, {
            "name": "B-1-1-4",
            "group": "B-1-1",
            'value': 2.7
        }, {
            "name": "B-1-1-5",
            "group": "B-1-1",
            'value': 2.6
        }, {
            "name": "B-1-1-6",
            "group": "B-1-1",
            'value': 2.5
        }, {
            "name": "B-1-1-7",
            "group": "B-1-1",
            'value': 2.4
        }, {
            "name": "B-1-1-8",
            "group": "B-1-1",
            'value': 2.3
        }, {
            "name": "B-1-1-9",
            "group": "B-1-1",
            'value': 2.2
        }, {
            "name": "B-1-1-10",
            "group": "B-1-1",
            'value': 2.2
        }, {
            "name": "B-1-1-11",
            "group": "B-1-1",
            'value': 1.1
        }, {
            'id': 'B-1-2',
            "name": "B-1-2",
            "group": "B-1",
            'color': '#666600'
        },{
            "name": "B-1-2-1",
            "group": "B-1-2",
            'value': 2.28
        },{
            "name": "B-1-2-2",
            "group": "B-1-2",
            'value': 2.05
        },{
            "name": "B-1-2-3",
            "group": "B-1-2",
            'value': 1.77
        },{
            "name": "B-1-2-4",
            "group": "B-1-2",
            'value': 1.73
        },{
            "name": "B-1-2-5",
            "group": "B-1-2",
            'value': 1.71
        },{
            "name": "B-1-2-6",
            "group": "B-1-2",
            'value': 1.5
        },{
            "name": "B-1-2-7",
            "group": "B-1-2",
            'value': 1.499
        },{
            "name": "B-1-2-8",
            "group": "B-1-2",
            'value': 1.487
        },{
            "name": "B-1-2-9",
            "group": "B-1-2",
            'value': 1.465
        },{
            "name": "B-1-2-10",
            "group": "B-1-2",
            'value': 1.45
        },{
            "name": "B-1-2-11",
            "group": "B-1-2",
            'value': 1.44
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 1.42
        },{
            "name": "B-1-2-13",
            "group": "B-1-2",
            'value': 1.39
        },{
            "name": "B-1-2-14",
            "group": "B-1-2",
            'value': 1.37
        },{
            "name": "B-1-2-15",
            "group": "B-1-2",
            'value': 1.35
        },{
            "name": "B-1-2-16",
            "group": "B-1-2",
            'value': 1.34
        },{
            "name": "B-1-2-17",
            "group": "B-1-2",
            'value': 1.33
        },{
            "name": "B-1-2-18",
            "group": "B-1-2",
            'value': 1.32
        },{
            "name": "B-1-2-19",
            "group": "B-1-2",
            'value': 1.31
        },{
            "name": "B-1-2-20",
            "group": "B-1-2",
            'value': 1.30
        },{
            "name": "B-1-2-21",
            "group": "B-1-2",
            'value': 1.29
        },{
            "name": "B-1-2-22",
            "group": "B-1-2",
            'value': 1.28
        },{
            "name": "B-1-2-23",
            "group": "B-1-2",
            'value': 1.27
        },{
            "name": "B-1-2-24",
            "group": "B-1-2",
            'value': 1.26
        },{
            "name": "B-1-2-25",
            "group": "B-1-2",
            'value': 1.25
        },{
            "name": "B-1-2-26",
            "group": "B-1-2",
            'value': 1.24
        },{
            "name": "B-1-2-27",
            "group": "B-1-2",
            'value': 1.23
        },{
            "name": "B-1-2-28",
            "group": "B-1-2",
            'value': 1.22
        },{
            "name": "B-1-2-29",
            "group": "B-1-2",
            'value': 1.21
        },{
            "name": "B-1-2-30",
            "group": "B-1-2",
            'value': 1.20
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 1.19
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 1.18
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.17
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.16
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.15
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.14
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.13
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.12
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.11
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.10
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.09
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.08
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.07
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.06
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.05
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.04
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.03
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.02
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.01
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.009
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.008
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 0.007
        },{
            "id": "C-1",
            "name": "C-1",
            "group": "C",
        }, {
            'id': 'C-1-1',
            "name": "C-1-1",
            "group": "C-1",
            'color': '#7FFF00'
        }, {
            "name": "C-1-1-1",
            "group": "C-1-1",
            'value': 0.921
        }, {
            "name": "C-1-1-2",
            "group": "C-1-1",
            'value': 0.911
        }, {
            "name": "C-1-1-3",
            "group": "C-1-1",
            'value': 0.899
        }, {
            "name": "C-1-1-4",
            "group": "C-1-1",
            'value': 0.894
        }, {
            "name": "C-1-1-5",
            "group": "C-1-1",
            'value': 0.874
        }, {
            "name": "C-1-1-6",
            "group": "C-1-1",
            'value': 0.831
        }, {
            "name": "C-1-1-7",
            "group": "C-1-1",
            'value': 0.797
        }, {
            "name": "C-1-1-8",
            "group": "C-1-1",
            'value': 0.734
        }, {
            "name": "C-1-1-9",
            "group": "C-1-1",
            'value': 0.711
        }, {
            "name": "C-1-1-10",
            "group": "C-1-1",
            'value': 0.701
        }, {
            "name": "C-1-1-11",
            "group": "C-1-1",
            'value': 0.698
        }, {
            "name": "C-1-1-12",
            "group": "C-1-1",
            'value': 0.684
        }, {
            "name": "C-1-1-13",
            "group": "C-1-1",
            'value': 0.682
        }, {
            "name": "C-1-1-14",
            "group": "C-1-1",
            'value': 0.681
        }, {
            "name": "C-1-1-20",
            "group": "C-1-1",
            'value': 0.655
        }, {
            "name": "C-1-1-21",
            "group": "C-1-1",
            'value': 0.642
        }, {
            "name": "C-1-1-22",
            "group": "C-1-1",
            'value': 0.612
        }, {
            "name": "C-1-1-23",
            "group": "C-1-1",
            'value': 0.598
        }, {
            "name": "C-1-1-24",
            "group": "C-1-1",
            'value': 0.597
        },{
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.417
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.411
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.398
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.387
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.374
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.364
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.351
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.348
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.293
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.291
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.290
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.289
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.287
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.286
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.285
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.283
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.244
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.235
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.212
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.189
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.149
        }, {
            "name": "C-1-1-43",
            "group": "C-1-1",
            'value': 0.1
        }, {
            'id':'C-1-2',
            "name": "C-1-2",
            "group": "C-1",
            'color': '#008000'
        },{
            "name": "C-1-2-1",
            "group": "C-1-2",
            'value': 1.88
        },{
            "name": "C-1-2-2",
            "group": "C-1-2",
            'value': 0.48
        },{
            "name": "C-1-2-3",
            "group": "C-1-2",
            'value': 0.44
        },{
            "name": "C-1-2-4",
            "group": "C-1-2",
            'value': 0.40
        },{
            "name": "C-1-2-5",
            "group": "C-1-2",
            'value': 0.36
        },{
            "name": "C-1-2-6",
            "group": "C-1-2",
            'value': 0.32
        },{
            "name": "C-1-2-7",
            "group": "C-1-2",
            'value': 0.28
        },{
            "name": "C-1-2-8",
            "group": "C-1-2",
            'value': 0.24
        },{
            "name": "C-1-2-9",
            "group": "C-1-2",
            'value': 0.20
        },{
            "name": "C-1-2-10",
            "group": "C-1-2",
            'value': 0.16
        },{
            "name": "C-1-2-11",
            "group": "C-1-2",
            'value': 0.1
        },{
            "id": "C-2",
            "name": "C-2",
            "group": "C",
        }, {
            "id": "C-2-1",
            "name": "C-2-1",
            "group": "C-2",
        },{
            'id': 'C-2-1-1',
            "name": "C-2-1-1",
            "group": "C-2-1",
            'color': '#00FFFF'
        },{
            "name": "C-2-1-1-1",
            "group": "C-2-1-1",
            'value': 0.91
        },{
            "name": "C-2-1-1-2",
            "group": "C-2-1-1",
            'value': 0.58
        },{
            "name": "C-2-1-1-3",
            "group": "C-2-1-1",
            'value': 0.53
        },{
            "name": "C-2-1-1-4",
            "group": "C-2-1-1",
            'value': 0.52
        },{
            "name": "C-2-1-1-5",
            "group": "C-2-1-1",
            'value': 0.50
        },{
            "name": "C-2-1-1-6",
            "group": "C-2-1-1",
            'value': 0.49
        },{
            "name": "C-2-1-1-7",
            "group": "C-2-1-1",
            'value': 0.34
        },{
            "name": "C-2-1-1-8",
            "group": "C-2-1-1",
            'value': 0.12
        },{
            "name": "C-2-1-1-9",
            "group": "C-2-1-1",
            'value': 0.09
        },{
            "name": "C-2-1-1-10",
            "group": "C-2-1-1",
            'value': 0.08
        },{
            "name": "C-2-1-1-11",
            "group": "C-2-1-1",
            'value': 0.07
        },{
            'id': 'C-2-1-2',
            "name": "C-2-1-2",
            "group": "C-2-1",
            'color': '#87CEEB'
        },{
            "name": "C-2-1-2-1",
            "group": "C-2-1-2",
            'value': 1.49
        },{
            "name": "C-2-1-2-2",
            "group": "C-2-1-2",
            'value': 0.89
        },{
            "name": "C-2-1-2-3",
            "group": "C-2-1-2",
            'value': 0.87
        },{
            "name": "C-2-1-2-4",
            "group": "C-2-1-2",
            'value': 0.82
        },{
            "name": "C-2-1-2-5",
            "group": "C-2-1-2",
            'value': 0.78
        },{
            "name": "C-2-1-2-6",
            "group": "C-2-1-2",
            'value': 0.74
        },{
            "name": "C-2-1-2-7",
            "group": "C-2-1-2",
            'value': 0.70
        },{
            "name": "C-2-1-2-8",
            "group": "C-2-1-2",
            'value': 0.67
        },{
            "name": "C-2-1-2-9",
            "group": "C-2-1-2",
            'value': 0.64
        },{
            "name": "C-2-1-2-10",
            "group": "C-2-1-2",
            'value': 0.62
        },{
            "name": "C-2-1-2-11",
            "group": "C-2-1-2",
            'value': 0.60
        },{
            "name": "C-2-1-2-12",
            "group": "C-2-1-2",
            'value': 0.58
        },{
            "name": "C-2-1-2-13",
            "group": "C-2-1-2",
            'value': 0.54
        },{
            "name": "C-2-1-2-14",
            "group": "C-2-1-2",
            'value': 0.51
        },{
            "name": "C-2-1-2-15",
            "group": "C-2-1-2",
            'value': 0.48
        },{
            "name": "C-2-1-2-16",
            "group": "C-2-1-2",
            'value': 0.38
        },{
            "name": "C-2-1-2-17",
            "group": "C-2-1-2",
            'value': 0.1
        },{
            'id': 'C-2-1-3',
            "name": "C-2-1-3",
            "group": "C-2-1",
            'color': '#98FF98'
        },{
            "name": "C-2-1-3-1",
            "group": "C-2-1-3",
            'value': 1.85
        },{
            "name": "C-2-1-3-2",
            "group": "C-2-1-3",
            'value': 0.54
        },{
            "name": "C-2-1-3-3",
            "group": "C-2-1-3",
            'value': 0.44
        },{
            "name": "C-2-1-3-4",
            "group": "C-2-1-3",
            'value': 0.39
        },{
            "name": "C-2-1-3-5",
            "group": "C-2-1-3",
            'value': 0.37
        },{
            "name": "C-2-1-3-6",
            "group": "C-2-1-3",
            'value': 0.28
        },{
            "name": "C-2-1-3-7",
            "group": "C-2-1-3",
            'value': 0.21
        },{
            "name": "C-2-1-3-8",
            "group": "C-2-1-3",
            'value': 0.14
        },{
            "name": "C-2-1-3-9",
            "group": "C-2-1-3",
            'value': 0.1
        },
        // C-2-1
        {
            "id": "C-2-2",
            "name": "C-2-2",
            "group": "C-2",
        },{
            'id': 'C-2-2-1',
            "name": "C-2-2-1",
            "group": "C-2-2",
            'color':'#0000FF'
        },{
            "name": "C-2-2-1-1",
            "group": "C-2-2-1",
            'value': 0.83
        },{
            "name": "C-2-2-1-2",
            "group": "C-2-2-1",
            'value': 0.81
        },{
            "name": "C-2-2-1-3",
            "group": "C-2-2-1",
            'value': 0.78
        },{
            "name": "C-2-2-1-4",
            "group": "C-2-2-1",
            'value': 0.75
        },{
            "name": "C-2-2-1-5",
            "group": "C-2-2-1",
            'value': 0.72
        },{
            "name": "C-2-2-1-6",
            "group": "C-2-2-1",
            'value': 0.67
        },{
            "name": "C-2-2-1-7",
            "group": "C-2-2-1",
            'value': 0.61
        },{
            "name": "C-2-2-1-8",
            "group": "C-2-2-1",
            'value': 0.57
        },{
            "name": "C-2-2-1-9",
            "group": "C-2-2-1",
            'value': 0.53
        },{
            "name": "C-2-2-1-10",
            "group": "C-2-2-1",
            'value': 0.51
        },{
            "name": "C-2-2-1-11",
            "group": "C-2-2-1",
            'value': 0.42
        },{
            "name": "C-2-2-1-11",
            "group": "C-2-2-1",
            'value': 0.40
        },{
            "name": "C-2-2-1-11",
            "group": "C-2-2-1",
            'value': 0.39
        },{
            "name": "C-2-2-1-11",
            "group": "C-2-2-1",
            'value': 0.38
        },{
            "name": "C-2-2-1-11",
            "group": "C-2-2-1",
            'value': 0.37
        },{
            "name": "C-2-2-1-11",
            "group": "C-2-2-1",
            'value': 0.36
        },{
            "name": "C-2-2-1-11",
            "group": "C-2-2-1",
            'value': 0.32
        },{
            "name": "C-2-2-1-11",
            "group": "C-2-2-1",
            'value': 0.28
        },{
            "name": "C-2-2-1-11",
            "group": "C-2-2-1",
            'value': 0.27
        },{
            "name": "C-2-2-1-11",
            "group": "C-2-2-1",
            'value': 0.18
        },{
            "name": "C-2-2-1-11",
            "group": "C-2-2-1",
            'value': 0.11
        },{
            'id': 'C-2-2-2',
            "name": "C-2-2-2",
            "group": "C-2-2",
            'color':'#000080'
        },{
            "name": "C-2-2-2-1",
            "group": "C-2-2-2",
            'value': 0.6
        },{
            "name": "C-2-2-2-2",
            "group": "C-2-2-2",
            'value': 0.58
        },{
            "name": "C-2-2-2-3",
            "group": "C-2-2-2",
            'value': 0.55
        },{
            "name": "C-2-2-2-4",
            "group": "C-2-2-2",
            'value': 0.45
        },{
            "name": "C-2-2-2-5",
            "group": "C-2-2-2",
            'value': 0.35
        },{
            "name": "C-2-2-2-6",
            "group": "C-2-2-2",
            'value': 0.34
        },{
            "name": "C-2-2-2-7",
            "group": "C-2-2-2",
            'value': 0.33
        },{
            "name": "C-2-2-2-8",
            "group": "C-2-2-2",
            'value': 0.26
        },{
            "name": "C-2-2-2-9",
            "group": "C-2-2-2",
            'value': 0.22
        },{
            "name": "C-2-2-2-10",
            "group": "C-2-2-2",
            'value': 0.21
        },{
            "name": "C-2-2-2-11",
            "group": "C-2-2-2",
            'value': 0.17
        },{
            'id': 'C-2-2-3',
            "name": "C-2-2-3",
            "group": "C-2-2",
            'color': '#800080'
        },{
            "name": "C-2-2-3-1",
            "group": "C-2-2-3",
            'value': 0.85
        },{
            "name": "C-2-2-3-2",
            "group": "C-2-2-3",
            'value': 0.33
        },{
            "name": "C-2-2-3-3",
            "group": "C-2-2-3",
            'value': 0.28
        },{
            "name": "C-2-2-3-4",
            "group": "C-2-2-3",
            'value': 0.16
        },{
            'id': 'C-2-2-4-1',
            "name": "C-2-2-4",
            "group": "C-2-2",
            'color': '#FFC0CB'
        },{
            "name": "C-2-2-4-1",
            "group": "C-2-2-4-1",
            'value':0.41
        },{
            "name": "C-2-2-4-2",
            "group": "C-2-2-4-1",
            'value':0.34
        },{
            "name": "C-2-2-4-3",
            "group": "C-2-2-4-1",
            'value':0.29
        },{
            "name": "C-2-2-4-4",
            "group": "C-2-2-4-1",
            'value':0.27
        },{
            "name": "C-2-2-4-5",
            "group": "C-2-2-4-1",
            'value':0.25
        },{
            "name": "C-2-2-4-6",
            "group": "C-2-2-4-1",
            'value':0.24
        },{
            "name": "C-2-2-4-7",
            "group": "C-2-2-4-1",
            'value':0.21
        },{
            "name": "C-2-2-4-8",
            "group": "C-2-2-4-1",
            'value':0.20
        },{
            "name": "C-2-2-4-9",
            "group": "C-2-2-4-1",
            'value':0.19
        },{
            "name": "C-2-2-4-10",
            "group": "C-2-2-4-1",
            'value':0.18
        },{
            "name": "C-2-2-4-11",
            "group": "C-2-2-4-1",
            'value':0.17
        },{
            "name": "C-2-2-4-12",
            "group": "C-2-2-4-1",
            'value':0.16
        },{
            "name": "C-2-2-4-13",
            "group": "C-2-2-4-1",
            'value':0.15
        },{
            "name": "C-2-2-4-14",
            "group": "C-2-2-4-1",
            'value':0.14
        },{
            "name": "C-2-2-4-15",
            "group": "C-2-2-4-1",
            'value':0.13
        },{
            "name": "C-2-2-4-16",
            "group": "C-2-2-4-1",
            'value':0.12
        },{
            "name": "C-2-2-4-17",
            "group": "C-2-2-4-1",
            'value':0.11
        },{
            "name": "C-2-2-4-18",
            "group": "C-2-2-4-1",
            'value':0.09
        },{
            "name": "C-2-2-4-19",
            "group": "C-2-2-4-1",
            'value':0.08
        },{
            "name": "C-2-2-4-20",
            "group": "C-2-2-4-1",
            'value':0.07
        },
        // C-2-2
        {
            "id": "C-2-3",
            "name": "C-2-3",
            "group": "C-2",
        },{
            'id': 'C-2-3-1',
            "name": "C-2-3-1",
            "group": "C-2-3",
            'color': '#A52A2A'
        },{
            "name": "C-2-3-1-1",
            "group": "C-2-3-1",
            'value':0.64
        },{
            "name": "C-2-3-1-2",
            "group": "C-2-3-1",
            'value':0.55
        },{
            "name": "C-2-3-1-3",
            "group": "C-2-3-1",
            'value':0.45
        },{
            "name": "C-2-3-1-4",
            "group": "C-2-3-1",
            'value':0.42
        },{
            "name": "C-2-3-1-5",
            "group": "C-2-3-1",
            'value':0.29
        },{
            "name": "C-2-3-1-6",
            "group": "C-2-3-1",
            'value':0.18
        },{
            "name": "C-2-3-1-6",
            "group": "C-2-3-1",
            'value':0.17
        },{
            "name": "C-2-3-1-6",
            "group": "C-2-3-1",
            'value':0.16
        },{
            "name": "C-2-3-1-6",
            "group": "C-2-3-1",
            'value':0.15
        },{
            "name": "C-2-3-1-6",
            "group": "C-2-3-1",
            'value':0.14
        },{
            "name": "C-2-3-1-6",
            "group": "C-2-3-1",
            'value':0.13
        },{
            "name": "C-2-3-1-6",
            "group": "C-2-3-1",
            'value':0.12
        },{
            "name": "C-2-3-1-6",
            "group": "C-2-3-1",
            'value':0.1
        },{
            "name": "C-2-3-1-6",
            "group": "C-2-3-1",
            'value':0.09
        },{
            'id': 'C-2-3-2',
            "name": "C-2-3-2",
            "group": "C-2-3",
        },{
            'id': 'C-2-3-2-1',
            "name": "C-2-3-2-1",
            "group": "C-2-3-2",
            'color': '#008080'
        },{
            "name": "C-2-3-2-1-1",
            "group": "C-2-3-2-1",
            'value': 0.099
        },{
            "name": "C-2-3-2-1-2",
            "group": "C-2-3-2-1",
            'value': 0.069
        },{
            "name": "C-2-3-2-1-3",
            "group": "C-2-3-2-1",
            'value': 0.056
        },{
            "name": "C-2-3-2-1-4",
            "group": "C-2-3-2-1",
            'value': 0.043
        },{
            "name": "C-2-3-2-1-5",
            "group": "C-2-3-2-1",
            'value': 0.034
        },{
            "name": "C-2-3-2-1-6",
            "group": "C-2-3-2-1",
            'value': 0.024
        },{
            "name": "C-2-3-2-1-7",
            "group": "C-2-3-2-1",
            'value': 0.054
        },{
            "name": "C-2-3-2-1-8",
            "group": "C-2-3-2-1",
            'value': 0.075
        },{
            "name": "C-2-3-2-1-9",
            "group": "C-2-3-2-1",
            'value': 0.072
        },{
            "name": "C-2-3-2-1-10",
            "group": "C-2-3-2-1",
            'value': 0.068
        },{
            "name": "C-2-3-2-1-11",
            "group": "C-2-3-2-1",
            'value': 0.012
        },{
            'id': 'C-2-3-2-2',
            "name": "C-2-3-2-2",
            "group": "C-2-3-2",
            'color': '#ADD8E6'
        },{
            "name": "C-2-3-2-2-1",
            "group": "C-2-3-2-2",
            'value': 0.189
        },{
            "name": "C-2-3-2-2-2",
            "group": "C-2-3-2-2",
            'value': 0.184
        },{
            "name": "C-2-3-2-2-4",
            "group": "C-2-3-2-2",
            'value': 0.181
        },{
            "name": "C-2-3-2-2-5",
            "group": "C-2-3-2-2",
            'value': 0.176
        },{
            "name": "C-2-3-2-2-6",
            "group": "C-2-3-2-2",
            'value': 0.164
        },{
            "name": "C-2-3-2-2-7",
            "group": "C-2-3-2-2",
            'value': 0.158
        },{
            "name": "C-2-3-2-2-8",
            "group": "C-2-3-2-2",
            'value': 0.149
        },{
            "name": "C-2-3-2-2-9",
            "group": "C-2-3-2-2",
            'value': 0.138
        },{
            "name": "C-2-3-2-2-10",
            "group": "C-2-3-2-2",
            'value': 0.129
        },{
            "name": "C-2-3-2-2-11",
            "group": "C-2-3-2-2",
            'value': 0.121
        },{
            "name": "C-2-3-2-2-12",
            "group": "C-2-3-2-2",
            'value': 0.119
        },{
            "name": "C-2-3-2-2-13",
            "group": "C-2-3-2-2",
            'value': 0.118
        },{
            "name": "C-2-3-2-2-14",
            "group": "C-2-3-2-2",
            'value': 0.112
        },{
            "name": "C-2-3-2-2-15",
            "group": "C-2-3-2-2",
            'value': 0.09
        },{
            'id': 'C-2-3-3',
            "name": "C-2-3-3",
            "group": "C-2-3",
        },{
            'id': 'C-2-3-3-1',
            "name": "C-2-3-3-1",
            "group": "C-2-3-3",
            'color': '#800000'
        },{
            "name": "C-2-3-3-1-1",
            "group": "C-2-3-3-1",
            'value': 0.09499
        },{
            "name": "C-2-3-3-1-2",
            "group": "C-2-3-3-1",
            'value': 0.09494
        },{
            "name": "C-2-3-3-1-3",
            "group": "C-2-3-3-1",
            'value': 0.09492
        },{
            "name": "C-2-3-3-1-4",
            "group": "C-2-3-3-1",
            'value': 0.09487
        },{
            "name": "C-2-3-3-1-5",
            "group": "C-2-3-3-1",
            'value': 0.09484
        },{
            "name": "C-2-3-3-1-6",
            "group": "C-2-3-3-1",
            'value': 0.09482
        },{
            "name": "C-2-3-3-1-7",
            "group": "C-2-3-3-1",
            'value': 0.09475
        },{
            "name": "C-2-3-3-1-8",
            "group": "C-2-3-3-1",
            'value': 0.09472
        },{
            "name": "C-2-3-3-1-9",
            "group": "C-2-3-3-1",
            'value': 0.09471
        },{
            "name": "C-2-3-3-1-10",
            "group": "C-2-3-3-1",
            'value': 0.09468
        },{
            "name": "C-2-3-3-1-11",
            "group": "C-2-3-3-1",
            'value': 0.09439
        },{
            "name": "C-2-3-3-1-12",
            "group": "C-2-3-3-1",
            'value': 0.09437
        },{
            "name": "C-2-3-3-1-13",
            "group": "C-2-3-3-1",
            'value': 0.09435
        },{
            "name": "C-2-3-3-1-14",
            "group": "C-2-3-3-1",
            'value': 0.09432
        },{
            "name": "C-2-3-3-1-15",
            "group": "C-2-3-3-1",
            'value': 0.09430
        },{
            "name": "C-2-3-3-1-15",
            "group": "C-2-3-3-1",
            'value': 0.09430
        },{
            "name": "C-2-3-3-1-15",
            "group": "C-2-3-3-1",
            'value': 0.0930
        },{
            "name": "C-2-3-3-1-15",
            "group": "C-2-3-3-1",
            'value': 0.09430
        },{
            'id': 'C-2-3-3-2',
            "name": "C-2-3-3-2",
            "group": "C-2-3-3",
            'color': '#FFD700'
        },{
            "name": "C-2-3-3-2-1",
            "group": "C-2-3-3-2",
            'value': 0.099
        },{
            "name": "C-2-3-3-2-2",
            "group": "C-2-3-3-2",
            'value': 0.093
        },{
            "name": "C-2-3-3-2-3",
            "group": "C-2-3-3-2",
            'value': 0.083
        },{
            "name": "C-2-3-3-2-4",
            "group": "C-2-3-3-2",
            'value': 0.81
        },{
            "name": "C-2-3-3-2-5",
            "group": "C-2-3-3-2",
            'value': 0.76
        },{
            "name": "C-2-3-3-2-6",
            "group": "C-2-3-3-2",
            'value': 0.74
        },{
            "name": "C-2-3-3-2-7",
            "group": "C-2-3-3-2",
            'value': 0.72
        },{
            "name": "C-2-3-3-2-8",
            "group": "C-2-3-3-2",
            'value': 0.71
        },{
            "name": "C-2-3-3-2-9",
            "group": "C-2-3-3-2",
            'value': 0.68
        },{
            "name": "C-2-3-3-2-10",
            "group": "C-2-3-3-2",
            'value': 0.65
        },{
            "name": "C-2-3-3-2-11",
            "group": "C-2-3-3-2",
            'value': 0.62
        },{
            "name": "C-2-3-3-2-12",
            "group": "C-2-3-3-2",
            'value': 0.21
        },{
            "name": "C-2-3-3-2-13",
            "group": "C-2-3-3-2",
            'value': 0.59
        },{
            "name": "C-2-3-3-2-14",
            "group": "C-2-3-3-2",
            'value': 0.55
        },{
            "name": "C-2-3-3-2-15",
            "group": "C-2-3-3-2",
            'value': 0.52
        },{
            'id': 'C-2-3-4',
            "name": "C-2-3-4",
            "group": "C-2-3",
        },{
            'id': 'C-2-3-4-1',
            "name": "C-2-3-4-1",
            "group": "C-2-3-4",
            'color': '#E6E6FA'
        },{
            "name": "C-2-3-4-1-1",
            "group": "C-2-3-4-1",
            'value': 0.093
        },{
            "name": "C-2-3-4-1-2",
            "group": "C-2-3-4-1",
            'value': 0.091
        },{
            "name": "C-2-3-4-1-3",
            "group": "C-2-3-4-1",
            'value': 0.075
        },{
            "name": "C-2-3-4-1-4",
            "group": "C-2-3-4-1",
            'value': 0.074
        },{
            "name": "C-2-3-4-1-5",
            "group": "C-2-3-4-1",
            'value': 0.073
        },{
            "name": "C-2-3-4-1-6",
            "group": "C-2-3-4-1",
            'value': 0.071
        },{
            "name": "C-2-3-4-1-7",
            "group": "C-2-3-4-1",
            'value': 0.064
        },{
            "name": "C-2-3-4-1-8",
            "group": "C-2-3-4-1",
            'value': 0.061
        },{
            "name": "C-2-3-4-1-9",
            "group": "C-2-3-4-1",
            'value': 0.060
        },{
            "name": "C-2-3-4-1-10",
            "group": "C-2-3-4-1",
            'value': 0.058
        },{
            "name": "C-2-3-4-1-11",
            "group": "C-2-3-4-1",
            'value': 0.052
        },{
            'id': 'C-2-3-4-2',
            "name": "C-2-3-4-2",
            "group": "C-2-3-4",
            'color': '#808080'
        },{
            "name": "C-2-3-4-2-1",
            "group": "C-2-3-4-2",
            'value': 0.054
        },{
            "name": "C-2-3-4-2-2",
            "group": "C-2-3-4-2",
            'value': 0.052
        },{
            "name": "C-2-3-4-2-3",
            "group": "C-2-3-4-2",
            'value': 0.051
        },{
            "name": "C-2-3-4-2-4",
            "group": "C-2-3-4-2",
            'value': 0.048
        },{
            "name": "C-2-3-4-2-5",
            "group": "C-2-3-4-2",
            'value': 0.043
        },{
            "name": "C-2-3-4-2-6",
            "group": "C-2-3-4-2",
            'value': 0.041
        },{
            "name": "C-2-3-4-2-7",
            "group": "C-2-3-4-2",
            'value': 0.040
        },{
            "name": "C-2-3-4-2-8",
            "group": "C-2-3-4-2",
            'value': 0.039
        },{
            "name": "C-2-3-4-2-9",
            "group": "C-2-3-4-2",
            'value': 0.031
        },{
            "name": "C-2-3-4-2-10",
            "group": "C-2-3-4-2",
            'value': 0.033
        },{
            "name": "C-2-3-4-2-11",
            "group": "C-2-3-4-2",
            'value': 0.033
        },{
            "name": "C-2-3-4-2-12",
            "group": "C-2-3-4-2",
            'value': 0.033
        },{
            'id': "C-2-3-4-3",
            "name": "C-2-3-4-3",
            "group": "C-2-3-4",
            'color': '#A75D67'
        },{
            "name": "C-2-3-4-3-1",
            "group": "C-2-3-4-3",
            'value': 0.098
        },{
            "name": "C-2-3-4-3-2",
            "group": "C-2-3-4-3",
            'value': 0.093
        },{
            "name": "C-2-3-4-3-3",
            "group": "C-2-3-4-3",
            'value': 0.091
        },{
            "name": "C-2-3-4-3-4",
            "group": "C-2-3-4-3",
            'value': 0.087
        },{
            "name": "C-2-3-4-3-5",
            "group": "C-2-3-4-3",
            'value': 0.084
        },{
            "name": "C-2-3-4-3-6",
            "group": "C-2-3-4-3",
            'value': 0.080
        },{
            "name": "C-2-3-4-3-7",
            "group": "C-2-3-4-3",
            'value': 0.078
        },{
            "name": "C-2-3-4-3-8",
            "group": "C-2-3-4-3",
            'value': 0.072
        },{
            "name": "C-2-3-4-3-9",
            "group": "C-2-3-4-3",
            'value': 0.068
        },{
            "name": "C-2-3-4-3-10",
            "group": "C-2-3-4-3",
            'value': 0.063
        },{
            "name": "C-2-3-4-3-11",
            "group": "C-2-3-4-3",
            'value': 0.051
        },{
            "name": "C-2-3-4-3-12",
            "group": "C-2-3-4-3",
            'value': 0.054
        },{
            "name": "C-2-3-4-3-13",
            "group": "C-2-3-4-3",
            'value': 0.059
        },{
            "name": "C-2-3-4-3-14",
            "group": "C-2-3-4-3",
            'value': 0.043
        },{
            "name": "C-2-3-4-3-15",
            "group": "C-2-3-4-3",
            'value': 0.042
        },{
            "name": "C-2-3-4-3-16",
            "group": "C-2-3-4-3",
            'value': 0.014
        },{
            "name": "C-2-3-4-3-17",
            "group": "C-2-3-4-3",
            'value': 0.001
        },{
            'id': 'C-2-3-4-4',
            "name": "C-2-3-4-4",
            "group": "C-2-3-4",
            'color': '#98FF98'
        },{
            "name": "C-2-3-4-4-1",
            "group": "C-2-3-4-4",
            'value': 0.099
        },{
            "name": "C-2-3-4-4-2",
            "group": "C-2-3-4-4",
            'value': 0.098
        },{
            "name": "C-2-3-4-4-3",
            "group": "C-2-3-4-4",
            'value': 0.094
        },{
            "name": "C-2-3-4-4-4",
            "group": "C-2-3-4-4",
            'value': 0.093
        },{
            "name": "C-2-3-4-4-5",
            "group": "C-2-3-4-4",
            'value': 0.092
        },{
            "name": "C-2-3-4-4-6",
            "group": "C-2-3-4-4",
            'value': 0.091
        },{
            "name": "C-2-3-4-4-7",
            "group": "C-2-3-4-4",
            'value': 0.090
        },{
            "name": "C-2-3-4-4-8",
            "group": "C-2-3-4-4",
            'value': 0.089
        },{
            "name": "C-2-3-4-4-9",
            "group": "C-2-3-4-4",
            'value': 0.088
        },{
            "name": "C-2-3-4-4-10",
            "group": "C-2-3-4-4",
            'value': 0.086
        },{
            "name": "C-2-3-4-4-11",
            "group": "C-2-3-4-4",
            'value': 0.084
        },{
            "name": "C-2-3-4-4-12",
            "group": "C-2-3-4-4",
            'value': 0.083
        },{
            "name": "C-2-3-4-4-13",
            "group": "C-2-3-4-4",
            'value': 0.081
        },{
            "name": "C-2-3-4-4-14",
            "group": "C-2-3-4-4",
            'value': 0.078
        },{
            "name": "C-2-3-4-4-15",
            "group": "C-2-3-4-4",
            'value': 0.076
        },{
            "name": "C-2-3-4-4-16",
            "group": "C-2-3-4-4",
            'value': 0.074
        },{
            "name": "C-2-3-4-4-17",
            "group": "C-2-3-4-4",
            'value': 0.072
        },{
            "name": "C-2-3-4-4-18",
            "group": "C-2-3-4-4",
            'value': 0.068
        },{
            "name": "C-2-3-4-4-19",
            "group": "C-2-3-4-4",
            'value': 0.064
        },{
            "name": "C-2-3-4-4-20",
            "group": "C-2-3-4-4",
            'value': 0.062
        },{
            "name": "C-2-3-4-4-21",
            "group": "C-2-3-4-4",
            'value': 0.059
        },{
            "name": "C-2-3-4-4-22",
            "group": "C-2-3-4-4",
            'value': 0.058
        },{
            "name": "C-2-3-4-4-23",
            "group": "C-2-3-4-4",
            'value': 0.057
        },{
            "name": "C-2-3-4-4-24",
            "group": "C-2-3-4-4",
            'value': 0.055
        },{
            "name": "C-2-3-4-4-25",
            "group": "C-2-3-4-4",
            'value': 0.053
        },{
            "name": "C-2-3-4-4-26",
            "group": "C-2-3-4-4",
            'value': 0.052
        },{
            "name": "C-2-3-4-4-27",
            "group": "C-2-3-4-4",
            'value': 0.051
        },{
            "name": "C-2-3-4-4-28",
            "group": "C-2-3-4-4",
            'value': 0.049
        },{
            "name": "C-2-3-4-4-29",
            "group": "C-2-3-4-4",
            'value': 0.048
        },{
            "name": "C-2-3-4-4-30",
            "group": "C-2-3-4-4",
            'value': 0.047
        },{
            "name": "C-2-3-4-4-31",
            "group": "C-2-3-4-4",
            'value': 0.046
        },{
            "name": "C-2-3-4-4-32",
            "group": "C-2-3-4-4",
            'value': 0.045
        },{
            "name": "C-2-3-4-4-33",
            "group": "C-2-3-4-4",
            'value': 0.044
        },{
            "name": "C-2-3-4-4-34",
            "group": "C-2-3-4-4",
            'value': 0.043
        },{
            "name": "C-2-3-4-4-34",
            "group": "C-2-3-4-4",
            'value': 0.043
        },{
            "name": "C-2-3-4-4-35",
            "group": "C-2-3-4-4",
            'value': 0.042
        },{
            "name": "C-2-3-4-4-36",
            "group": "C-2-3-4-4",
            'value': 0.041
        },{
            "name": "C-2-3-4-4-37",
            "group": "C-2-3-4-4",
            'value': 0.040
        },
        //C-2-3
    ],
        style: {
        }
    }
}
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
