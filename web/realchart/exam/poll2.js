
const [catiMainData] = data.filter(row => row['구분'] == '전체');
const catiAreaData = data.filter(row => row['구분'] == '7개 권역');
const catiAgeData = data.filter(row => row['구분'] == '연령대');
const catiGenderData = data.filter(row => row['구분'] == '성별');
const [catiMaleData] = catiGenderData.filter(row => row['구분값'] == '남성');
const [catiFemaleData] = catiGenderData.filter(row => row['구분값'] == '여성');

const pointLabel = {
    visible: true,
    numberFormat: '#.00',
    suffix: '%',
    position: 'inside',
};

const piePointLabel = {
   ...pointLabel,
   text: '${x}<br>${y}%',
};


const pieChart = {
    type: 'pie',
    startAngle: -90,
    totalAngle: 180,
    // inverted: true,
    yAxis: 0,
    radius: '30%',
    centerY: '100%',
    innerRadius: '40%',
    // innerText: '<t style="fill:#000;font-weight:bold;font-size:24px">OS</t>',
    // legendByPoint: true,
    pointLabel: piePointLabel,
}

// CATI main response
const catiPie = {
    ...pieChart,
    radius: '60%',
    xAxis: 0,
    data: Object.entries(catiMainData)
        .filter((_, i) => [3,4,5,6,9].includes(i))
        .map(([key, value], i) => {
            return { label: key, value }
        }),
}

const catiPieByMale = {
    ...pieChart,
    xAxis: 1,
    data: Object.entries(catiMaleData)
        .filter((_, i) => [7,8,9].includes(i))
        .map(([key, value], i) => {
            return { label: key, value }
        }),
}

const catiPieByFemale = {
    ...pieChart,
    xAxis: 2,
    data: Object.entries(catiFemaleData)
        .filter((_, i) => [7,8,9].includes(i))
        .map(([key, value], i) => {
            return { label: key, value }
        }),
}

const pieXAxis = {
    line: false,
    label: false,
};

const pieYAxis = {
    row: 0,
    line: false,
    label: false,
}

const barXAxis = {
    type: 'category',
    row: 1,
    line: true,
    label: true,
    // position: 'opposite'
}

const barYAxis = {
    type: 'linear',
    row: 1,
    line: true,
    label: true,
    maxValue: 100,
}

const catiBar = {
    type: 'bar',
    color: '#0098ff',
    // pointWidth: 1,
    layout: 'stack',
    // maxValue: 100,
    // inverted: true,
}

// 권역별
const catiBarByArea = {
    ...catiBar,
    // visibleInLegend: false,
    xAxis: 4,
    yAxis: 4,
    children: [
        {
            name: '긍정',
            xField: '구분값',
            yField: '긍정',
            pointLabel,
            data: catiAreaData,
        },
        {
            name: '부정',
            xField: '구분값',
            yField: '부정',
            pointLabel,
            data: catiAreaData,
        },
        {
            name: '모름|무응답',
            xField: '구분값',
            yField: '모름|무응답',
            pointLabel,
            data: catiAreaData,
        }
    ]
};

const catiBarByAge = {
    ...catiBar,
    visibleInLegend: true,
    xAxis: 5,
    yAxis: 5,
    children: [
        {
            name: '긍정',
            xField: '구분값',
            yField: '긍정',
            pointLabel,
            data: catiAgeData,
        },
        {
            name: '부정',
            xField: '구분값',
            yField: '부정',
            pointLabel,
            data: catiAgeData,
        },
        {
            name: '모름|무응답',
            xField: '구분값',
            yField: '모름|무응답',
            pointLabel,
            data: catiAgeData,
        }
    ]
};

const config = {
    // inverted: true,
    options: {
        // animatable: false
    },
    title: {
        text: '2023년 11월',
        gap: 10,
        backgroundStyle: {
            fill: 'black',
            rx: '3px'
        },
        style: {
            fill: '#fff',
            fontSize: '16px',
            padding: '2px 5px',
        }
    },
    subtitle: {
        text: '여론 조사',
        style: {
            fill: 'black',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '10px'
        }
    },
    split: {
        visible: true,
        cols: 3,
        rows: 2,
    },
    legend: {
        visible: false,
        align: 'left',
        itemGap: 20,
        markerGap: 10,
        offsetX: 20,
        style: {
            marginRight: '20px'
        }
    },
    xAxis: Array(3).fill(pieXAxis).map((v, i) => {
        v.col = i;
        return {...v};
    }).concat(Array(3).fill(barXAxis).map((v, i) => {
        v.col = i;
        return {...v}
    })),
    // yAxis: [pieYAxis, barYAxis],
    yAxis: Array(3).fill(pieYAxis).map((v, i) => {
        v.col = i;
        return {...v};
    }).concat(Array(3).fill(barYAxis).map((v, i) => {
        v.col = i;
        return {...v}
    })),
    series: [
        catiPie,
        catiPieByMale,
        catiPieByFemale,
        // null,
        catiBarByArea,
        catiBarByAge,
    ]
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createCheckBox(container, 'Always Animate', function (e) {
        animate = _getChecked(e);
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createListBox(container, "Line Type", ['default', 'spline', 'step'], function (e) {
        config.series.lineType = _getValue(e);
        chart.load(config, animate);
    }, 'default');
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
