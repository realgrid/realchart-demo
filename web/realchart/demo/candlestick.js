const config = {
    title: "Candlestick",
    options: {
        // animatable: false,
    },
    xAxis: {
        type: 'category',
    },
    yAxis: {
    },
    series: {
        type: 'candlestick',
        pointLabel: true,
        openField: 'openprc',
        highField: 'highprc',
        lowField: 'lowprc',
        closeField: 'closeprc',
        data: [{
            "openprc" : 22000,
            "highprc" : 22222,
            "lowprc" : 21400,
            "closeprc" : 21500,
            "trdvolume" : 14033,
            "trdamnt" : 324987500,
            "date" : "2019-01-11"
    },{
            "openprc" : 21400,
            "highprc" : 21300,
            "lowprc" : 21700,
            "closeprc" : 21250,
            "trdvolume" : 11608,
            "trdamnt" : 266665250,
            "date" : "2019-01-14"
    },{
            "openprc" : 21630,
            "highprc" : 22500,
            "lowprc" : 21200,
            "closeprc" : 22300,
            "trdvolume" : 31502,
            "trdamnt" : 713561800,
            "date" : "2019-01-15"
    },{
            "openprc" : 22000,
            "highprc" : 22500,
            "lowprc" : 21600,
            "closeprc" : 22300,
            "trdvolume" : 16853,
            "trdamnt" : 383179850,
            "date" : "2019-01-16"
    },{
            "openprc" : 22850,
            "highprc" : 23050,
            "lowprc" : 22550,
            "closeprc" : 22850,
            "trdvolume" : 7571,
            "trdamnt" : 172444650,
            "date" : "2019-01-17"
    },{
            "openprc" : 22850,
            "highprc" : 22900,
            "lowprc" : 22400,
            "closeprc" : 22500,
            "trdvolume" : 11942,
            "trdamnt" : 269458200,
            "date" : "2019-01-18"
    },{
            "openprc" : 22450,
            "highprc" : 22550,
            "lowprc" : 21550,
            "closeprc" : 21700,
            "trdvolume" : 50060,
            "trdamnt" : 1094399700,
            "date" : "2019-01-21"
    },{
            "openprc" : 21750,
            "highprc" : 21950,
            "lowprc" : 21550,
            "closeprc" : 21700,
            "trdvolume" : 23327,
            "trdamnt" : 505653900,
            "date" : "2019-01-22"
    },{
            "openprc" : 21950,
            "highprc" : 21950,
            "lowprc" : 21500,
            "closeprc" : 21700,
            "trdvolume" : 11106,
            "trdamnt" : 241429700,
            "date" : "2019-01-23"
    },{
            "openprc" : 21900,
            "highprc" : 21900,
            "lowprc" : 21550,
            "closeprc" : 21650,
            "trdvolume" : 10902,
            "trdamnt" : 237351300,
            "date" : "2019-01-24"
    },{
            "openprc" : 21800,
            "highprc" : 21850,
            "lowprc" : 21300,
            "closeprc" : 21800,
            "trdvolume" : 17613,
            "trdamnt" : 379367900,
            "date" : "2019-01-25"
    },{
            "openprc" : 21950,
            "highprc" : 22150,
            "lowprc" : 21650,
            "closeprc" : 22050,
            "trdvolume" : 13681,
            "trdamnt" : 299266150,
            "date" : "2019-01-28"
    },{
            "openprc" : 22050,
            "highprc" : 22400,
            "lowprc" : 22050,
            "closeprc" : 22350,
            "trdvolume" : 13651,
            "trdamnt" : 303871550,
            "date" : "2019-01-29"
    },{
            "openprc" : 22400,
            "highprc" : 22400,
            "lowprc" : 21900,
            "closeprc" : 21900,
            "trdvolume" : 11833,
            "trdamnt" : 260954750,
            "date" : "2019-01-30"
    },{
            "openprc" : 21950,
            "highprc" : 21950,
            "lowprc" : 21550,
            "closeprc" : 21700,
            "trdvolume" : 16518,
            "trdamnt" : 358109800,
            "date" : "2019-02-01"
    },{
            "openprc" : 21800,
            "highprc" : 21850,
            "lowprc" : 21500,
            "closeprc" : 21750,
            "trdvolume" : 9485,
            "trdamnt" : 205373700,
            "date" : "2019-02-04"
    },{
            "openprc" : 21700,
            "highprc" : 21800,
            "lowprc" : 21450,
            "closeprc" : 21600,
            "trdvolume" : 10826,
            "trdamnt" : 234154100,
            "date" : "2019-02-05"
    },{
            "openprc" : 21300,
            "highprc" : 21550,
            "lowprc" : 21000,
            "closeprc" : 21500,
            "trdvolume" : 15898,
            "trdamnt" : 338072500,
            "date" : "2019-02-06"
    },{
            "openprc" : 21400,
            "highprc" : 21450,
            "lowprc" : 21100,
            "closeprc" : 21450,
            "trdvolume" : 15513,
            "trdamnt" : 329680000,
            "date" : "2019-02-07"
    },{
            "openprc" : 21000,
            "highprc" : 21750,
            "lowprc" : 21000,
            "closeprc" : 21500,
            "trdvolume" : 8835,
            "trdamnt" : 189128000,
            "date" : "2019-02-08"
    },{
            "openprc" : 21500,
            "highprc" : 21550,
            "lowprc" : 21300,
            "closeprc" : 21450,
            "trdvolume" : 5568,
            "trdamnt" : 119232800,
            "date" : "2019-02-12"
    },{
            "openprc" : 21450,
            "highprc" : 21500,
            "lowprc" : 21000,
            "closeprc" : 21300,
            "trdvolume" : 14793,
            "trdamnt" : 314701900,
            "date" : "2019-02-13"
    },{
            "openprc" : 21300,
            "highprc" : 21700,
            "lowprc" : 21100,
            "closeprc" : 21600,
            "trdvolume" : 13703,
            "trdamnt" : 294467800,
            "date" : "2019-02-14"
    },{
            "openprc" : 21350,
            "highprc" : 22200,
            "lowprc" : 21350,
            "closeprc" : 22050,
            "trdvolume" : 19506,
            "trdamnt" : 428998650,
            "date" : "2019-02-15"
    },{
            "openprc" : 22050,
            "highprc" : 22250,
            "lowprc" : 21800,
            "closeprc" : 22100,
            "trdvolume" : 10535,
            "trdamnt" : 231930000,
            "date" : "2019-02-18"
    },{
            "openprc" : 22150,
            "highprc" : 22300,
            "lowprc" : 21750,
            "closeprc" : 22050,
            "trdvolume" : 7478,
            "trdamnt" : 164174050,
            "date" : "2019-02-19"
    },{
            "openprc" : 22050,
            "highprc" : 22600,
            "lowprc" : 21750,
            "closeprc" : 22450,
            "trdvolume" : 31989,
            "trdamnt" : 717825050,
            "date" : "2019-02-20"
    },{
            "openprc" : 22800,
            "highprc" : 23000,
            "lowprc" : 22600,
            "closeprc" : 22750,
            "trdvolume" : 43192,
            "trdamnt" : 986617500,
            "date" : "2019-02-21"
    },{
            "openprc" : 22750,
            "highprc" : 23050,
            "lowprc" : 22500,
            "closeprc" : 23000,
            "trdvolume" : 18101,
            "trdamnt" : 413611500,
            "date" : "2019-02-22"
    }]
    }
}

let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, true);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.update(config);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.update(config);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.update(config);
    }, false);
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
