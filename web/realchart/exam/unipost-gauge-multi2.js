const title = '계획 대비 실정 달성률';
const productData = [
    { productDivision: '회계솔루션' , salesStrtg: '6,710', currSales: 4150, achievePercent: 27, salesProduct: '신규' },
    { productDivision: '회계솔루션' , salesStrtg: '6,675', currSales: 1502, achievePercent: 23, salesProduct: '기능' },
    { productDivision: '회계솔루션' , salesStrtg: '3,711', currSales: 1007, achievePercent: 6, salesProduct: 'INF' },
    { productDivision: '회계솔루션' , salesStrtg: '400', currSales: 200, achievePercent: 52, salesProduct: 'Tax' },
    { productDivision: '회계솔루션' , salesStrtg: '70', currSales: 0, achievePercent: 0, salesProduct: 'Firm' },
    { productDivision: 'BP포탈' , salesStrtg: '120', currSales: 62, achievePercent: 50, salesProduct: 'Pro' },
]
  
const annotationArr = [];
const gaugeArr = [];
 // anchor 사용하지 않고 align이 right일때  offsetX , Y 기준이 다른
 // align right left 바운더리 밖으로 나가는 현상
let position = productData.length <= 6 ? 3 : 4;
position = 3;
var setChart = () => {
    var colorIndex = 0;
    var backgroundColor = ["#1632a2", "#11a44c", "#fd9c14"];
    for (var i = 0; i < productData.length; i++) {
        if (i == 0) {
        prevProd = productData[i].productDivision;
        } else if (prevProd != productData[i].productDivision) {
        colorIndex++;
        prevProd = productData[i].productDivision;
        }

        let annotation = {
        //계획금액 어노테이션
        text: '<t style="font-size:12pt;">계획금액 : </t>',
        anchor: 'gauge'+i,
        verticalAlign: 'bottom',
        align: 'left',
        offsetX: -80,
        offsetY: -5,
        front: true,
        style: {
            fill: "#000000",
            textAlign: "center"
        }
        };
        annotationArr.push(annotation);

        annotation = {
        //실적금액 어노테이션
        text: '<t style="font-size:12pt;">실적금액 : </t>',
        anchor: 'gauge'+i,
        verticalAlign: 'bottom',
        align: 'left',
        offsetX: -80,
        offsetY: 20,
        front: true,
        style: {
            fill: "#000000",
            textAlign: "center"
        }
        };
        annotationArr.push(annotation);

        annotation = {
        //계획금액 어노테이션
        text: '<t style="font-size:12pt;">' + productData[i].salesStrtg + "</t>",
        anchor: 'gauge'+i,
        verticalAlign: 'bottom',
        align: 'right',
        offsetX: -60,
        offsetY: -5,
        front: true,
        style: {
            fill: "#000000",
            textAlign: "center"
        }
        };
        annotationArr.push(annotation);

        annotation = {
        //실적금액 어노테이션
        text: '<t style="font-size:12pt;">' + productData[i].currSales + "</t>",
        anchor: 'gauge'+i,
        verticalAlign: 'bottom',
        align: 'right',
        offsetX: -60,
        offsetY: 20,
        front: true,
        style: {
            fill: "#000000",
            textAlign: "center"
        }
        };
        annotationArr.push(annotation);

        annotation = {
        //영업제품 어노테이션
        type: "shape",
        shape: "rectangle",
        front: true,
        width: "200px",
        height: "30px",
        anchor: 'gauge'+i,
        offsetY: -10,
        align: "center",
        style: {
            fill: backgroundColor[colorIndex],
            textAlign: "center",
            stroke: "#000000"
        }
        };
        annotationArr.push(annotation);

        annotation = {
        //영업제품 텍스트 어노테이션
        type: "text",
        text:
            '<t style="font-size:12pt; font-weight: bold;">' +
            productData[i].productDivision +
            "</t>",
        front: true,
        anchor: 'gauge'+i,
        offsetY: -5,
        style: {
            fill: "#ffffff",
            textAlign: "center"
        }
        };
        annotationArr.push(annotation);

        const gauge = {
        template: "gauge",
        name: "gauge" + i,
        top: i < 3 ? 40 : "53%",
        left: i % 3 === 0 ? '10%' : i % 3 === 1? '40%' : '70%',
        value: productData[i].achievePercent, //달성률 값
        innerRadius: "85%", //게이지 두께
        valueRim: {
            stroked: true, //게이지 스타일
            style: {
            strokeLinecap: "round"
            }
        },
        backgroundStyle: {
            //상자
            stroke: "lightblue",
            strokeWidth: "2px",
            borderRadius: "10px",
            height: "300px", //상자 크기
            width: "250px",
            verticalAlign: "middle",
            align: "center"
        },
        label: {
            text:
            '<t style="fill:blue">${value}</t><t style="font-size:12px;"></t><t style="font-size:20px;">%</t><br><t style="font-size:18px;font-weight:normal">' +
            productData[i].salesProduct +
            "</t>",
            style: {
            fontWeight: "bold"
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
        width: "250px",
        height: "250px",
        innerRadius: "93%",
        verticalAlign: "middle",
        align: "center",
        valueRim: {
          //범위별로 스타일 지정
          ranges: [
            {
              toValue: 25,
              color: "green"
            },
            {
              toValue: 50,
              color: "#0000cc"
            },
            {
              toValue: 75,
              color: "#ffaa00"
            },
            {
              color: "red"
            }
          ]
        }
      }
    },
    title: title,
    body: {
      annotations: annotationArr,
    },
    gauge: gaugeArr
};

setChart()

function init() {
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
}
