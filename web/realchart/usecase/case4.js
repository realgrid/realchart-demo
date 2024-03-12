const title = '계획 대비 실정 달성률 (반기)';
const productData = [
    { productDivision: 'A솔루션', salesStrtg: '662,110,000', currSales: '489,961,400', achievePercent: 74, salesProduct: '신규' },
    { productDivision: 'B솔루션', salesStrtg: '651,675,000', currSales: '632,124,750', achievePercent: 97, salesProduct: '기능' },
    { productDivision: 'C솔루션', salesStrtg: '377,110,000', currSales: '494,014,100', achievePercent: 131, salesProduct: 'INF' },
    { productDivision: 'D솔루션', salesStrtg: '269,110,000', currSales: '565,131,000', achievePercent: 210, salesProduct: 'Tax' },
    { productDivision: 'E솔루션', salesStrtg: '443,272,000', currSales: '443,272,000', achievePercent: 100, salesProduct: 'Firm' },
    { productDivision: 'BP포탈', salesStrtg: '441,231,000', currSales: '220,615,500', achievePercent: 50, salesProduct: 'Pro' }
];

const annotationArr = [];
const gaugeArr = [];
let position = productData.length <= 6 ? 3 : 4;
position = 3;
var setChart = () => {
    var colorIndex = 0;
    var backgroundColor = ['#0098ff', '#ff9f00', '#fd9c14'];
    for (var i = 0; i < productData.length; i++) {
        if (i == 0) {
            prevProd = productData[i].productDivision;
        } else if (i == 5) {
            colorIndex++;
            prevProd = productData[i].productDivision;
        }

        let annotation = {
            //계획금액 어노테이션
            text: '<t style="font-size:12pt;">계획금액 : </t>',
            anchor: 'gauge' + i,
            verticalAlign: 'bottom',
            align: 'left',
            offsetX: -80,
            offsetY: -5,
            front: true,
            style: {
                fill: '#000000',
                textAlign: 'center'
            }
        };
        annotationArr.push(annotation);

        annotation = {
            //실적금액 어노테이션
            text: '<t style="font-size:12pt;">실적금액 : </t>',
            anchor: 'gauge' + i,
            verticalAlign: 'bottom',
            align: 'left',
            offsetX: -80,
            offsetY: 20,
            front: true,
            style: {
                fill: '#000000',
                textAlign: 'center'
            }
        };
        annotationArr.push(annotation);

        annotation = {
            //계획금액 어노테이션
            text: '<t style="font-size:12pt;">' + productData[i].salesStrtg + '</t>',
            anchor: 'gauge' + i,
            verticalAlign: 'bottom',
            align: 'right',
            offsetX: -100,
            offsetY: -5,
            front: true,
            style: {
                fill: '#000000',
                textAlign: 'center'
            }
        };
        annotationArr.push(annotation);

        annotation = {
            //실적금액 어노테이션
            text: '<t style="font-size:12pt;">' + productData[i].currSales + '</t>',
            anchor: 'gauge' + i,
            numberFormat: '#,##0',
            verticalAlign: 'bottom',
            align: 'right',
            offsetX: -100,
            offsetY: 20,
            front: true,
            style: {
                fill: '#000000',
                textAlign: 'center'
            }
        };
        annotationArr.push(annotation);

        annotation = {
            //영업제품 어노테이션
            type: 'shape',
            shape: 'rectangle',
            front: true,
            width: '200px',
            height: '30px',
            anchor: 'gauge' + i,
            offsetY: -10,
            align: 'center',
            style: {
                fill: backgroundColor[colorIndex],
                textAlign: 'center',
                stroke: 'none'
            }
        };
        annotationArr.push(annotation);

        annotation = {
            //영업제품 텍스트 어노테이션
            type: 'text',
            text: '<t style="font-size:12pt; font-weight: bold;">' + productData[i].productDivision + '</t>',
            front: true,
            anchor: 'gauge' + i,
            offsetY: -5,
            style: {
                fill: '#ffffff',
                textAlign: 'center'
            }
        };
        annotationArr.push(annotation);

        const gauge = {
            template: 'gauge',
            maxValue: Math.max(100, productData[i].achievePercent),
            name: 'gauge' + i,
            top: i < 3 ? 40 : '57%',
            left: i % 3 === 0 ? '7%' : i % 3 === 1 ? '37%' : '67%',
            value: productData[i].achievePercent, //달성률 값
            innerRadius: '85%', //게이지 두께
            valueRim: {
                stroked: true, //게이지 스타일
                style: {
                    strokeLinecap: 'round'
                }
            },
            backgroundStyle: {
                //상자
                stroke: '#c5c9ca',
                strokeWidth: '2px',
                borderRadius: '10px',
                height: '300px', //상자 크기
                width: '250px',
                verticalAlign: 'middle',
                align: 'center'
            },
            label: {
                text:
                    '<t style="fill:#533cf5">${value}</t><t style="font-size:12px;"></t><t style="font-size:20px;">%</t><br><t style="font-size:18px;font-weight:normal">' +
                    productData[i].salesProduct +
                    '</t>',
                style: {
                    fontWeight: 'bold'
                }
            }
        };
        gaugeArr.push(gauge);
    }
};

let animate;
let chart;
let timer;
const config = {
    templates: {
        gauge: {
            width: '250px',
            height: '250px',
            innerRadius: '93%',
            verticalAlign: 'middle',
            align: 'center',
            valueRim: {
                //범위별로 스타일 지정
                ranges: [
                    {
                        toValue: 25,
                        color: '#ff5c35'
                    },
                    {
                        toValue: 50,
                        color: '#66d0ff'
                    },
                    {
                        toValue: 75,
                        color: '#66d0ff'
                    },
                    {
                        color: '#66d0ff'
                    }
                ]
            }
        }
    },
    title: title,
    subtitle: {
        text: '※ 비정기 금액 기준',
        align: 'right'
    },
    body: {
        annotations: annotationArr
    },
    gauge: gaugeArr
};

setChart();

function init() {
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
}
