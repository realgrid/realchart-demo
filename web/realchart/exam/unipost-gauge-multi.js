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

let position = productData.length <= 6 ? 3 : 4;
position = 3;
var setChart = () => {
    var offsetX,
        offsetY,
        offsetX2,
        offsetY2,
        offsetX3,
        offsetY3,
        offsetX4,
        offsetY4,
        centerX,
        centerY,
        textX1,
        textY1,
        textX2,
        textY2;
    var setOffsetX, offsetAddX, offsetAddY, setCenterX, setTextX;
    var backgroundColor = ["#1632a2", "#11a44c", "#fd9c14"];
    var colorIndex = 0;
    var prevProd;

    if (position == 3) {
        //3개씩
        offsetY = 295; //계획금액 Y 위치
        offsetY2 = 320; //실적금액 Y 위치
        offsetY3 = 45; //업무구분 Y 위치
        offsetY4 = 48; //업무구분 Y 위치
        textY1 = 295;
        textY2 = 320;

        centerX = 0; //게이지 X 위치
        centerY = 20; //게이지 Y위치

        setOffsetX = -277;
        offsetAddX = 300;
        offsetAddY = 330;

        setCenterX = 150;
        setTextX = 390;
    } else {
        //4개씩
        offsetY = 295; //계획금액 Y 위치
        offsetY2 = 320; //실적금액 Y 위치
        offsetY3 = 45; //업무구분 Y 위치
        offsetY4 = 48; //업무구분 Y 위치
        textY1 = 295;
        textY2 = 320;

        centerX = 0; //게이지 X 위치
        centerY = 20; //게이지 Y위치

        setOffsetX = -427;
        offsetAddX = 270;
        offsetAddY = 330;

        setCenterX = 0;
        setTextX = 480;
    }

    //centerY = 300

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
        offsetX:
            i % position == 0
            ? (offsetX = setOffsetX - 52)
            : (offsetX += offsetAddX),
        offsetY: i != 0 && i % position == 0 ? (offsetY += offsetAddY) : offsetY,
        align: "center",
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
        offsetX:
            i % position == 0
            ? (offsetX2 = setOffsetX - 52)
            : (offsetX2 += offsetAddX),
        offsetY:
            i != 0 && i % position == 0 ? (offsetY2 += offsetAddY) : offsetY2,
        align: "center",
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
        offsetX:
            i % position == 0
            ? (textX1 = setOffsetX + setTextX)
            : (textX1 += offsetAddX),
        offsetY: i != 0 && i % position == 0 ? (textY1 += offsetAddY) : textY1,
        align: "right",
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
        offsetX:
            i % position == 0
            ? (textX2 = setOffsetX + setTextX)
            : (textX2 += offsetAddX),
        offsetY: i != 0 && i % position == 0 ? (textY2 += offsetAddY) : textY2,
        align: "right",
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
        offsetX:
            i % position == 0 ? (offsetX3 = setOffsetX) : (offsetX3 += offsetAddX),
        offsetY:
            i != 0 && i % position == 0 ? (offsetY3 += offsetAddY) : offsetY3,
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
        offsetX:
            i % position == 0 ? (offsetX4 = setOffsetX) : (offsetX4 += offsetAddX),
        offsetY:
            i != 0 && i % position == 0 ? (offsetY4 += offsetAddY) : offsetY4,
        align: "center",
        style: {
            fill: "#ffffff",
            textAlign: "center"
        }
        };
        annotationArr.push(annotation);

        const gauge = {
        template: "gauge",
        name: "gauge" + i,
        // left: i % position == 0 ? "10%" : "15%",
        // top: i != 0 && i % position == 0 ? (centerY += offsetAddY) : centerY,
        left : ((i) % position == 0) ?  centerX = setCenterX : centerX += offsetAddX,
        top :  (i!=0 && (i % position == 0)) ?  centerY += offsetAddY : centerY,
        // centerX : centerX, //((i) %3 == 0) ?  offsetX = -270 : offsetX += 270,
        // centerY : centerY, //(i!=0 && (i) %3 == 0) ?  offsetY += 250 : offsetY,
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
            '<t style="fill:blue">${value}</t><t style="font-size:12px;"> </t><t style="font-size:20px;">%</t><br><t style="font-size:18px;font-weight:normal">' +
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
    annotations: annotationArr,
    gauge: gaugeArr
};

setChart()

function init() {
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
}
