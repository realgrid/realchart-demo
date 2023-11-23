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
        }, {
            "id": "B",
            "name": "B",
            "color": "#F5FBEF"
        }, {
            "id": "C",
            "name": "C",
            "color": "#A09FA8"
        }, {
            'id': 'A-1',
            "name": "A-1",
            "group": "A",
            'color': '#FF0000'
        },{
            "name": "A-1-1",
            "group": "A-1",
            'value': 5
        },{
            "name": "A-1-2",
            "group": "A-1",
            'value': 5
        },{
            "name": "A-1-3",
            "group": "A-1",
            'value': 30
        },{
            "name": "A-1-4",
            "group": "A-1",
            'value': 25
        },{
            "name": "A-1-5",
            "group": "A-1",
            'value': 15
        },{
            "name": "A-1-6",
            "group": "A-1",
            'value': 5
        },{
            "name": "A-1-7",
            "group": "A-1",
            'value': 5
        },{
            "name": "A-1-8",
            "group": "A-1",
            'value': 5
        },{
            "name": "A-1-9",
            "group": "A-1",
            'value': 5
        },{
            "name": "A-1-10",
            "group": "A-1",
            'value': 5
        },{
            "name": "A-1-11",
            "group": "A-1",
            'value': 5
        },{
            "name": "A-1-12",
            "group": "A-1",
            'value': 5
        },{
            "name": "A-1-13",
            "group": "A-1",
            'value': 5
        },{
            "name": "A-1-14",
            "group": "A-1",
            'value': 5
        },{
            "name": "A-1-15",
            "group": "A-1",
            'value': 5
        },{
            "name": "A-1-16",
            "group": "A-1",
            'value': 5
        },{
            "name": "A-1-17",
            "group": "A-1",
            'value': 5
        },{
            "name": "A-1-18",
            "group": "A-1",
            'value': 5
        },{
            "name": "A-1-19",
            "group": "A-1",
            'value': 5
        },{
            "name": "A-1-20",
            "group": "A-1",
            'value': 5
        },{
            "name": "A-1-21",
            "group": "A-1",
            'value': 5
        },{
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
            'value': 1
        }, {
            "name": "B-1-1-2",
            "group": "B-1-1",
            'value': 1
        }, {
            "name": "B-1-1-3",
            "group": "B-1-1",
            'value': 1
        }, {
            "name": "B-1-1-4",
            "group": "B-1-1",
            'value': 1
        }, {
            "name": "B-1-1-5",
            "group": "B-1-1",
            'value': 1
        }, {
            "name": "B-1-1-6",
            "group": "B-1-1",
            'value': 1
        }, {
            "name": "B-1-1-7",
            "group": "B-1-1",
            'value': 1
        }, {
            "name": "B-1-1-8",
            "group": "B-1-1",
            'value': 1
        }, {
            "name": "B-1-1-9",
            "group": "B-1-1",
            'value': 1
        }, {
            "name": "B-1-1-10",
            "group": "B-1-1",
            'value': 1
        }, {
            "name": "B-1-1-11",
            "group": "B-1-1",
            'value': 1
        }, {
            'id': 'B-1-2',
            "name": "B-1-2",
            "group": "B-1",
            'color': '#FFFF00'
        },{
            "name": "B-1-2-1",
            "group": "B-1-2",
            'value': 1
        },{
            "name": "B-1-2-2",
            "group": "B-1-2",
            'value': 1
        },{
            "name": "B-1-2-3",
            "group": "B-1-2",
            'value': 1
        },{
            "name": "B-1-2-4",
            "group": "B-1-2",
            'value': 1
        },{
            "name": "B-1-2-5",
            "group": "B-1-2",
            'value': 1
        },{
            "name": "B-1-2-6",
            "group": "B-1-2",
            'value': 1
        },{
            "name": "B-1-2-7",
            "group": "B-1-2",
            'value': 1
        },{
            "name": "B-1-2-8",
            "group": "B-1-2",
            'value': 1
        },{
            "name": "B-1-2-9",
            "group": "B-1-2",
            'value': 1
        },{
            "name": "B-1-2-10",
            "group": "B-1-2",
            'value': 1
        },{
            "name": "B-1-2-11",
            "group": "B-1-2",
            'value': 1
        },{
            "name": "B-1-2-12",
            "group": "B-1-2",
            'value': 1
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
            'value': 1
        }, {
            "name": "C-1-1-2",
            "group": "C-1-1",
            'value': 1
        }, {
            "name": "C-1-1-3",
            "group": "C-1-1",
            'value': 1
        }, {
            "name": "C-1-1-4",
            "group": "C-1-1",
            'value': 1
        }, {
            "name": "C-1-1-5",
            "group": "C-1-1",
            'value': 1
        }, {
            "name": "C-1-1-6",
            "group": "C-1-1",
            'value': 1
        }, {
            "name": "C-1-1-7",
            "group": "C-1-1",
            'value': 1
        }, {
            "name": "C-1-1-8",
            "group": "C-1-1",
            'value': 1
        }, {
            "name": "C-1-1-9",
            "group": "C-1-1",
            'value': 1
        }, {
            "name": "C-1-1-10",
            "group": "C-1-1",
            'value': 1
        }, {
            "name": "C-1-1-11",
            "group": "C-1-1",
            'value': 1
        }, {
            'id':'C-1-2',
            "name": "C-1-2",
            "group": "C-1",
            'color': '#008000'
        },{
            "name": "C-1-2-1",
            "group": "C-1-2",
            'value': 1
        },{
            "name": "C-1-2-2",
            "group": "C-1-2",
            'value': 1
        },{
            "name": "C-1-2-3",
            "group": "C-1-2",
            'value': 1
        },{
            "name": "C-1-2-4",
            "group": "C-1-2",
            'value': 1
        },{
            "name": "C-1-2-5",
            "group": "C-1-2",
            'value': 1
        },{
            "name": "C-1-2-6",
            "group": "C-1-2",
            'value': 1
        },{
            "name": "C-1-2-7",
            "group": "C-1-2",
            'value': 1
        },{
            "name": "C-1-2-8",
            "group": "C-1-2",
            'value': 1
        },{
            "name": "C-1-2-9",
            "group": "C-1-2",
            'value': 1
        },{
            "name": "C-1-2-10",
            "group": "C-1-2",
            'value': 1
        },{
            "name": "C-1-2-11",
            "group": "C-1-2",
            'value': 1
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
            'value': 1
        },{
            "name": "C-2-1-1-2",
            "group": "C-2-1-1",
            'value': 1
        },{
            "name": "C-2-1-1-3",
            "group": "C-2-1-1",
            'value': 1
        },{
            "name": "C-2-1-1-4",
            "group": "C-2-1-1",
            'value': 1
        },{
            "name": "C-2-1-1-5",
            "group": "C-2-1-1",
            'value': 1
        },{
            "name": "C-2-1-1-6",
            "group": "C-2-1-1",
            'value': 1
        },{
            "name": "C-2-1-1-7",
            "group": "C-2-1-1",
            'value': 1
        },{
            "name": "C-2-1-1-8",
            "group": "C-2-1-1",
            'value': 1
        },{
            "name": "C-2-1-1-9",
            "group": "C-2-1-1",
            'value': 1
        },{
            "name": "C-2-1-1-10",
            "group": "C-2-1-1",
            'value': 1
        },{
            "name": "C-2-1-1-11",
            "group": "C-2-1-1",
            'value': 1
        },{
            'id': 'C-2-1-2',
            "name": "C-2-1-2",
            "group": "C-2-1",
            'color': '#87CEEB'
        },{
            "name": "C-2-1-2-1",
            "group": "C-2-1-2",
            'value': 1
        },{
            "name": "C-2-1-2-2",
            "group": "C-2-1-2",
            'value': 1
        },{
            "name": "C-2-1-2-3",
            "group": "C-2-1-2",
            'value': 1
        },{
            "name": "C-2-1-2-4",
            "group": "C-2-1-2",
            'value': 1
        },{
            "name": "C-2-1-2-5",
            "group": "C-2-1-2",
            'value': 1
        },{
            "name": "C-2-1-2-6",
            "group": "C-2-1-2",
            'value': 1
        },{
            "name": "C-2-1-2-7",
            "group": "C-2-1-2",
            'value': 1
        },{
            "name": "C-2-1-2-8",
            "group": "C-2-1-2",
            'value': 1
        },{
            "name": "C-2-1-2-9",
            "group": "C-2-1-2",
            'value': 1
        },{
            "name": "C-2-1-2-10",
            "group": "C-2-1-2",
            'value': 1
        },{
            "name": "C-2-1-2-11",
            "group": "C-2-1-2",
            'value': 1
        },{
            "name": "C-2-1-2-12",
            "group": "C-2-1-2",
            'value': 1
        },{
            "name": "C-2-1-2-13",
            "group": "C-2-1-2",
            'value': 1
        },{
            "name": "C-2-1-2-14",
            "group": "C-2-1-2",
            'value': 1
        },{
            "name": "C-2-1-2-15",
            "group": "C-2-1-2",
            'value': 1
        },{
            "name": "C-2-1-2-16",
            "group": "C-2-1-2",
            'value': 1
        },{
            "name": "C-2-1-2-17",
            "group": "C-2-1-2",
            'value': 1
        },{
            'id': 'C-2-1-3',
            "name": "C-2-1-3",
            "group": "C-2-1",
            'color': '#98FF98'
        },{
            "name": "C-2-1-3-1",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-2",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-3",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-4",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-5",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-6",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-7",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-8",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-9",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-10",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-11",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-12",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-13",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-14",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-15",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-16",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-17",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-18",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-19",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-20",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-21",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-22",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-23",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-24",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-25",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-26",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-27",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-28",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-29",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-30",
            "group": "C-2-1-3",
            'value': 1
        },{
            "name": "C-2-1-3-31",
            "group": "C-2-1-3",
            'value': 1
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
            'value': 1
        },{
            "name": "C-2-2-1-2",
            "group": "C-2-2-1",
            'value': 1
        },{
            "name": "C-2-2-1-3",
            "group": "C-2-2-1",
            'value': 1
        },{
            "name": "C-2-2-1-4",
            "group": "C-2-2-1",
            'value': 1
        },{
            "name": "C-2-2-1-5",
            "group": "C-2-2-1",
            'value': 1
        },{
            "name": "C-2-2-1-6",
            "group": "C-2-2-1",
            'value': 1
        },{
            "name": "C-2-2-1-7",
            "group": "C-2-2-1",
            'value': 1
        },{
            "name": "C-2-2-1-8",
            "group": "C-2-2-1",
            'value': 1
        },{
            "name": "C-2-2-1-9",
            "group": "C-2-2-1",
            'value': 1
        },{
            "name": "C-2-2-1-10",
            "group": "C-2-2-1",
            'value': 1
        },{
            "name": "C-2-2-1-11",
            "group": "C-2-2-1",
            'value': 1
        },{
            'id': 'C-2-2-2',
            "name": "C-2-2-2",
            "group": "C-2-2",
            'color':'#000080'
        },{
            "name": "C-2-2-2-1",
            "group": "C-2-2-2",
            'value': 1
        },{
            "name": "C-2-2-2-2",
            "group": "C-2-2-2",
            'value': 1
        },{
            "name": "C-2-2-2-3",
            "group": "C-2-2-2",
            'value': 1
        },{
            "name": "C-2-2-2-4",
            "group": "C-2-2-2",
            'value': 1
        },{
            "name": "C-2-2-2-5",
            "group": "C-2-2-2",
            'value': 1
        },{
            "name": "C-2-2-2-6",
            "group": "C-2-2-2",
            'value': 1
        },{
            "name": "C-2-2-2-7",
            "group": "C-2-2-2",
            'value': 1
        },{
            "name": "C-2-2-2-8",
            "group": "C-2-2-2",
            'value': 1
        },{
            "name": "C-2-2-2-9",
            "group": "C-2-2-2",
            'value': 1
        },{
            "name": "C-2-2-2-10",
            "group": "C-2-2-2",
            'value': 1
        },{
            "name": "C-2-2-2-11",
            "group": "C-2-2-2",
            'value': 1
        },{
            'id': 'C-2-2-3',
            "name": "C-2-2-3",
            "group": "C-2-2",
            'color': '#800080'
        },{
            "name": "C-2-2-3-1",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-2",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-3",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-4",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-5",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-6",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-7",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-8",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-9",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-10",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-11",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-12",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-13",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-14",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-15",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-16",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-17",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-18",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-19",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-20",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-21",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-22",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-23",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-24",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-25",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-26",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-27",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-28",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-29",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-30",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-31",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-32",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-33",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-34",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-35",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-36",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-37",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-38",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-39",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-40",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-41",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-42",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-43",
            "group": "C-2-2-3",
            'value': 1
        },{
            "name": "C-2-2-3-44",
            "group": "C-2-2-3",
            'value': 1
        },{
            'id': 'C-2-2-4-1',
            "name": "C-2-2-4",
            "group": "C-2-2",
            'color': '#FFC0CB'
        },{
            "name": "C-2-2-4-1",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-2",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-3",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-4",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-5",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-6",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-7",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-8",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-9",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-10",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-11",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-12",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-13",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-14",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-15",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-16",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-17",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-18",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-19",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-20",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-21",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-22",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-23",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-24",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-25",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-26",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-27",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-28",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-29",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-30",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-31",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-32",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-33",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-34",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-35",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-36",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-37",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-38",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-39",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-40",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-41",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-42",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-43",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-44",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-45",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-46",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-47",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-48",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-49",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-50",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-51",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-52",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-53",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-54",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-55",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-56",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-57",
            "group": "C-2-2-4-1",
            'value':1
        },{
            "name": "C-2-2-4-58",
            "group": "C-2-2-4-1",
            'value':1
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
            'value':1
        },{
            "name": "C-2-3-1-2",
            "group": "C-2-3-1",
            'value':1
        },{
            "name": "C-2-3-1-3",
            "group": "C-2-3-1",
            'value':1
        },{
            "name": "C-2-3-1-4",
            "group": "C-2-3-1",
            'value':1
        },{
            "name": "C-2-3-1-5",
            "group": "C-2-3-1",
            'value':1
        },{
            "name": "C-2-3-1-6",
            "group": "C-2-3-1",
            'value':1
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
            'value': 1
        },{
            "name": "C-2-3-2-1-2",
            "group": "C-2-3-2-1",
            'value': 1
        },{
            "name": "C-2-3-2-1-3",
            "group": "C-2-3-2-1",
            'value': 1
        },{
            "name": "C-2-3-2-1-4",
            "group": "C-2-3-2-1",
            'value': 1
        },{
            "name": "C-2-3-2-1-5",
            "group": "C-2-3-2-1",
            'value': 1
        },{
            "name": "C-2-3-2-1-6",
            "group": "C-2-3-2-1",
            'value': 1
        },{
            "name": "C-2-3-2-1-7",
            "group": "C-2-3-2-1",
            'value': 1
        },{
            "name": "C-2-3-2-1-8",
            "group": "C-2-3-2-1",
            'value': 1
        },{
            "name": "C-2-3-2-1-9",
            "group": "C-2-3-2-1",
            'value': 1
        },{
            "name": "C-2-3-2-1-10",
            "group": "C-2-3-2-1",
            'value': 1
        },{
            "name": "C-2-3-2-1-11",
            "group": "C-2-3-2-1",
            'value': 1
        },{
            'id': 'C-2-3-2-2',
            "name": "C-2-3-2-2",
            "group": "C-2-3-2",
            'color': '#ADD8E6'
        },{
            "name": "C-2-3-2-2-1",
            "group": "C-2-3-2-2",
            'value': 1
        },{
            "name": "C-2-3-2-2-2",
            "group": "C-2-3-2-2",
            'value': 1
        },{
            "name": "C-2-3-2-2-4",
            "group": "C-2-3-2-2",
            'value': 1
        },{
            "name": "C-2-3-2-2-5",
            "group": "C-2-3-2-2",
            'value': 1
        },{
            "name": "C-2-3-2-2-6",
            "group": "C-2-3-2-2",
            'value': 1
        },{
            "name": "C-2-3-2-2-7",
            "group": "C-2-3-2-2",
            'value': 1
        },{
            "name": "C-2-3-2-2-8",
            "group": "C-2-3-2-2",
            'value': 1
        },{
            "name": "C-2-3-2-2-9",
            "group": "C-2-3-2-2",
            'value': 1
        },{
            "name": "C-2-3-2-2-10",
            "group": "C-2-3-2-2",
            'value': 1
        },{
            "name": "C-2-3-2-2-11",
            "group": "C-2-3-2-2",
            'value': 1
        },{
            "name": "C-2-3-2-2-12",
            "group": "C-2-3-2-2",
            'value': 1
        },{
            "name": "C-2-3-2-2-13",
            "group": "C-2-3-2-2",
            'value': 1
        },{
            "name": "C-2-3-2-2-14",
            "group": "C-2-3-2-2",
            'value': 1
        },{
            "name": "C-2-3-2-2-15",
            "group": "C-2-3-2-2",
            'value': 1
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
            'value': 1
        },{
            "name": "C-2-3-3-1-2",
            "group": "C-2-3-3-1",
            'value': 1
        },{
            "name": "C-2-3-3-1-3",
            "group": "C-2-3-3-1",
            'value': 1
        },{
            "name": "C-2-3-3-1-4",
            "group": "C-2-3-3-1",
            'value': 1
        },{
            "name": "C-2-3-3-1-5",
            "group": "C-2-3-3-1",
            'value': 1
        },{
            "name": "C-2-3-3-1-6",
            "group": "C-2-3-3-1",
            'value': 1
        },{
            "name": "C-2-3-3-1-7",
            "group": "C-2-3-3-1",
            'value': 1
        },{
            "name": "C-2-3-3-1-8",
            "group": "C-2-3-3-1",
            'value': 1
        },{
            "name": "C-2-3-3-1-9",
            "group": "C-2-3-3-1",
            'value': 1
        },{
            "name": "C-2-3-3-1-10",
            "group": "C-2-3-3-1",
            'value': 1
        },{
            "name": "C-2-3-3-1-11",
            "group": "C-2-3-3-1",
            'value': 1
        },{
            "name": "C-2-3-3-1-12",
            "group": "C-2-3-3-1",
            'value': 1
        },{
            "name": "C-2-3-3-1-13",
            "group": "C-2-3-3-1",
            'value': 1
        },{
            "name": "C-2-3-3-1-14",
            "group": "C-2-3-3-1",
            'value': 1
        },{
            "name": "C-2-3-3-1-15",
            "group": "C-2-3-3-1",
            'value': 1
        },{
            'id': 'C-2-3-3-2',
            "name": "C-2-3-3-2",
            "group": "C-2-3-3",
            'color': '#FFD700'
        },{
            "name": "C-2-3-3-2-1",
            "group": "C-2-3-3-2",
            'value': 1
        },{
            "name": "C-2-3-3-2-2",
            "group": "C-2-3-3-2",
            'value': 1
        },{
            "name": "C-2-3-3-2-3",
            "group": "C-2-3-3-2",
            'value': 1
        },{
            "name": "C-2-3-3-2-4",
            "group": "C-2-3-3-2",
            'value': 1
        },{
            "name": "C-2-3-3-2-5",
            "group": "C-2-3-3-2",
            'value': 1
        },{
            "name": "C-2-3-3-2-6",
            "group": "C-2-3-3-2",
            'value': 1
        },{
            "name": "C-2-3-3-2-7",
            "group": "C-2-3-3-2",
            'value': 1
        },{
            "name": "C-2-3-3-2-8",
            "group": "C-2-3-3-2",
            'value': 1
        },{
            "name": "C-2-3-3-2-9",
            "group": "C-2-3-3-2",
            'value': 1
        },{
            "name": "C-2-3-3-2-10",
            "group": "C-2-3-3-2",
            'value': 1
        },{
            "name": "C-2-3-3-2-11",
            "group": "C-2-3-3-2",
            'value': 1
        },{
            "name": "C-2-3-3-2-12",
            "group": "C-2-3-3-2",
            'value': 1
        },{
            "name": "C-2-3-3-2-13",
            "group": "C-2-3-3-2",
            'value': 1
        },{
            "name": "C-2-3-3-2-14",
            "group": "C-2-3-3-2",
            'value': 1
        },{
            "name": "C-2-3-3-2-15",
            "group": "C-2-3-3-2",
            'value': 1
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
            'value': 1
        },{
            "name": "C-2-3-4-1-2",
            "group": "C-2-3-4-1",
            'value': 1
        },{
            "name": "C-2-3-4-1-3",
            "group": "C-2-3-4-1",
            'value': 1
        },{
            "name": "C-2-3-4-1-4",
            "group": "C-2-3-4-1",
            'value': 1
        },{
            "name": "C-2-3-4-1-5",
            "group": "C-2-3-4-1",
            'value': 1
        },{
            "name": "C-2-3-4-1-6",
            "group": "C-2-3-4-1",
            'value': 1
        },{
            "name": "C-2-3-4-1-7",
            "group": "C-2-3-4-1",
            'value': 1
        },{
            "name": "C-2-3-4-1-8",
            "group": "C-2-3-4-1",
            'value': 1
        },{
            "name": "C-2-3-4-1-9",
            "group": "C-2-3-4-1",
            'value': 1
        },{
            "name": "C-2-3-4-1-10",
            "group": "C-2-3-4-1",
            'value': 1
        },{
            "name": "C-2-3-4-1-11",
            "group": "C-2-3-4-1",
            'value': 1
        },{
            'id': 'C-2-3-4-2',
            "name": "C-2-3-4-2",
            "group": "C-2-3-4",
            'color': '#808080'
        },{
            "name": "C-2-3-4-2-1",
            "group": "C-2-3-4-2",
            'value': 1
        },{
            "name": "C-2-3-4-2-2",
            "group": "C-2-3-4-2",
            'value': 1
        },{
            "name": "C-2-3-4-2-3",
            "group": "C-2-3-4-2",
            'value': 1
        },{
            "name": "C-2-3-4-2-4",
            "group": "C-2-3-4-2",
            'value': 1
        },{
            "name": "C-2-3-4-2-5",
            "group": "C-2-3-4-2",
            'value': 1
        },{
            "name": "C-2-3-4-2-6",
            "group": "C-2-3-4-2",
            'value': 1
        },{
            "name": "C-2-3-4-2-7",
            "group": "C-2-3-4-2",
            'value': 1
        },{
            "name": "C-2-3-4-2-8",
            "group": "C-2-3-4-2",
            'value': 1
        },{
            "name": "C-2-3-4-2-9",
            "group": "C-2-3-4-2",
            'value': 1
        },{
            "name": "C-2-3-4-2-10",
            "group": "C-2-3-4-2",
            'value': 1
        },{
            "name": "C-2-3-4-2-11",
            "group": "C-2-3-4-2",
            'value': 1
        },{
            "name": "C-2-3-4-2-12",
            "group": "C-2-3-4-2",
            'value': 1
        },{
            'id': "C-2-3-4-3",
            "name": "C-2-3-4-3",
            "group": "C-2-3-4",
            'color': '#A75D67'
        },{
            "name": "C-2-3-4-3-1",
            "group": "C-2-3-4-3",
            'value': 1
        },{
            "name": "C-2-3-4-3-2",
            "group": "C-2-3-4-3",
            'value': 1
        },{
            "name": "C-2-3-4-3-3",
            "group": "C-2-3-4-3",
            'value': 1
        },{
            "name": "C-2-3-4-3-4",
            "group": "C-2-3-4-3",
            'value': 1
        },{
            "name": "C-2-3-4-3-5",
            "group": "C-2-3-4-3",
            'value': 1
        },{
            "name": "C-2-3-4-3-6",
            "group": "C-2-3-4-3",
            'value': 1
        },{
            "name": "C-2-3-4-3-7",
            "group": "C-2-3-4-3",
            'value': 1
        },{
            "name": "C-2-3-4-3-8",
            "group": "C-2-3-4-3",
            'value': 1
        },{
            "name": "C-2-3-4-3-9",
            "group": "C-2-3-4-3",
            'value': 1
        },{
            "name": "C-2-3-4-3-10",
            "group": "C-2-3-4-3",
            'value': 1
        },{
            "name": "C-2-3-4-3-11",
            "group": "C-2-3-4-3",
            'value': 1
        },{
            "name": "C-2-3-4-3-12",
            "group": "C-2-3-4-3",
            'value': 1
        },{
            "name": "C-2-3-4-3-13",
            "group": "C-2-3-4-3",
            'value': 1
        },{
            "name": "C-2-3-4-3-14",
            "group": "C-2-3-4-3",
            'value': 1
        },{
            "name": "C-2-3-4-3-15",
            "group": "C-2-3-4-3",
            'value': 1
        },{
            "name": "C-2-3-4-3-16",
            "group": "C-2-3-4-3",
            'value': 1
        },{
            "name": "C-2-3-4-3-17",
            "group": "C-2-3-4-3",
            'value': 1
        },{
            'id': 'C-2-3-4-4',
            "name": "C-2-3-4-4",
            "group": "C-2-3-4",
            'color': '#98FF98'
        },{
            "name": "C-2-3-4-4-1",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-2",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-3",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-4",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-5",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-6",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-7",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-8",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-9",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-10",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-11",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-12",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-13",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-14",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-15",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-16",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-17",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-18",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-19",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-20",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-21",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-22",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-23",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-24",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-25",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-26",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-27",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-28",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-29",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-30",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-31",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-32",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-33",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-34",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-34",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-35",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-36",
            "group": "C-2-3-4-4",
            'value': 1
        },{
            "name": "C-2-3-4-4-37",
            "group": "C-2-3-4-4",
            'value': 1
        },
        // C-2-3
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

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
