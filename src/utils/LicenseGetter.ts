/* eslint-disable no-prototype-builtins */
/* eslint-disable no-var */
declare var realChartLic: string;
/**
 * 다양한 환경에서 라이선스를 획득하는 모듈
 */
export default () => {
    /**
     * process 환경 변수를 얻을 수 있는 환경인가?
     */
    const hasProcess = () => {
        return !!(typeof process !== 'undefined' && process.env && process.env.hasOwnProperty('realChartLic'));
    }
    
    // process 환경변수를 사용할 수 있는 환경이면 환경 변수를 먼저 확인한다.
    if (hasProcess()) return process.env.realReportLic;
    else if (realChartLic) return realChartLic;
    else '';
};
