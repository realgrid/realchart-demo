/**
 * @demo
 *
 */


const rawData = `
34.8101	128.2375	-999	-999
34.6223	128.2735	-999	-999
35.0603	127.7664	720	6
34.9966	127.8324	-999	-999
35.2217	127.9284	-999	-999
35.5698	128.3411	-999	-999
35.3326	128.2023	-999	-999
35.1761	129.1624	-999	-999
35.1589	129.0192	-999	-999
35.2932	129.1035	-999	-999
35.2091	129.0901	2979	5
35.213	129.0026	-999	-999
35.135	129.1044	-999	-999
35.6674	129.3753	-999	-999
35.3853	128.5706	-999	-999
35.5345	127.99	-999	-999
35.7798	127.8183	401	8
34.7219	128.5908	-999	-999
35.3106	127.8358	-999	-999
35.6375	129.441	-999	-999
35.0901	128.9838	-999	-999
35.5087	126.9073	-999	-999
34.9984	128.6798	-999	-999
35.431	129.3601	-999	-999
37.325	126.3933	3250	60
36.77	125.9767	3430	65
35.9867	126.225	3360	53
35.6133	126.245	770	39
34.2633	126.0267	50	81
33.2233	126.6542	540	63
34.285	127.8578	30	121
35.5667	129.475	3360	83
37.1161	126.3856	2976	76
37.1189	126.6128	1664	3
35.081	129.045	3012	41
35.091	129.127	2728	43
38.2014	127.2502	2320	5
35.2439	128.1547	375	7
36.6363	127.4428	377	12
37.9026	127.7378	141	17
33.2613	126.4893	242	18
38.2509	128.5647	80	6
38.0667	128.6667	2560	74
37.9475	127.7547	950	1
38.1479	127.3042	497	1
37.2395	131.8698	-999	-999
37.8859	126.7665	0	0
37.6771	128.7183	2433	44
37.9026	127.7357	3006	3
37.974	124.7124	3151	55
37.8046	128.8554	1664	23
37.7515	128.891	2328	36
37.5071	129.1243	2308	5
37.5714	126.9658	2808	18
37.5683	126.7756	3200	13
37.4777	126.6249	205	21
37.4625	126.4392	3100	25
37.3376	127.9466	38	0
37.4813	130.8986	3011	31
37.4453	126.964	2817	15
37.2723	126.9853	2820	13
37.1813	128.4574	774	4
36.9704	127.9527	2804	10
36.7766	126.4939	71	10
36.9918	129.4128	2432	35
36.6392	127.4407	1465	11
36.372	127.3721	823	6
36.2202	127.9946	2597	39
36.5729	128.7073	3499	10
36.4084	128.1574	2402	26
36.032	129.38	2337	15
36.0053	126.7614	1359	3
35.878	128.653	2687	35
35.8408	127.119	1370	7
35.5933	129.3522	100	64
35.5825	129.3347	3475	28
35.1702	128.5728	3413	20
35.1729	126.8916	3100	13
35.1047	129.032	2963	48
35.1188	129	2837	130
34.8455	128.4356	3560	24
34.9914	126.3831	800	7
34.8169	126.3812	332	22
34.8467	127.6125	3100	61
34.7393	127.7406	2267	26
34.6872	125.451	3391	67
34.3959	126.7018	3058	23
35.3489	126.599	2955	3
35.0204	127.3694	3024	20
34.4721	126.3238	1	51
36.6576	126.6877	2655	0
33.5167	126.5	3400	34
33.5141	126.5297	2942	38
33.2938	126.1628	201	110
33.3868	126.8802	181	21
33.2461	126.5653	5	12
35.1638	128.04	525	6
37.7074	126.4463	3493	16
37.4886	127.4945	1986	2`
const lines = rawData.split('\n');
console.log(lines)
const transformedData = lines.map(line => {
  const [x, y, angle, length] = line.split('\t').map(Number);
  console.log(Math.log(length))
  return { x, y, angle: angle/10, length: Math.log10(length) };
});
console.log(transformedData);
const a = transformedData.filter(e => {
	if(e.x === 0) return false; 
	if(e.angle === -999) return false; 
	if(e.length === -999 || e.length === 0) return false; 
	return true
})
	console.log(a)

	console.log(JSON.stringify(a))
const data = a;
const config = {
    title: 'Vector Series',
    inverted: true,
    xAxis: {
        title: 'X Axis'
    },
    yAxis: {
        strictMin: 125,
        strictMax: 132
    },
    series: {
        type: 'vector',
        tooltipText: 'length: ${length}<br>angle: ${angle}',
        // arrowHead: 'open',
        // arrowHead: 'none',
        data: data,
        style: {
            // stroke: 'red'
        }
    }
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
