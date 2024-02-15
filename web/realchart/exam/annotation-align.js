const title = '계획 대비 실정 달성률';
const productData = { productDivision: '회계솔루션', salesStrtg: '6,710', currSales: 4150, achievePercent: 27, salesProduct: '신규' };
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
                        color: 'green'
                    },
                    {
                        toValue: 50,
                        color: '#0000cc'
                    },
                    {
                        toValue: 75,
                        color: '#ffaa00'
                    },
                    {
                        color: 'red'
                    }
                ]
            }
        }
    },
    title: title,
    body: {
        annotations: [
            {
                //계획금액 어노테이션
                text: '<t style="font-size:12pt;">계획금액 : </t>',
                anchor: 'gauge',
                verticalAlign: 'bottom',
                align: 'left',
                front: true,
                style: {
                    fill: '#000000',
                    textAlign: 'center'
                }
            }
        ]
    },
    gauge: [
        {
            template: 'gauge',
            name: 'gauge',
            value: productData.achievePercent, //달성률 값
            innerRadius: '85%', //게이지 두께
            valueRim: {
                stroked: true, //게이지 스타일
                style: {
                    strokeLinecap: 'round'
                }
            },
            backgroundStyle: {
                //상자
                stroke: 'lightblue',
                strokeWidth: '2px',
                borderRadius: '10px',
                height: '300px', //상자 크기
                width: '250px',
                verticalAlign: 'middle',
                align: 'center'
            },
            label: {
                text:
                    '<t style="fill:blue">${value}</t><t style="font-size:12px;"> </t><t style="font-size:20px;">%</t><br><t style="font-size:18px;font-weight:normal">' +
                    productData.salesProduct +
                    '</t>',
                style: {
                    fontWeight: 'bold'
                }
            }
        }
    ]
};

setChart();

function init() {
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
}
