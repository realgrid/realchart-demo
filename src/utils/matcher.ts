import matchurl from 'match-url-wildcard';

const dom = location ? location.hostname : undefined;

// 함수에서 앞, 뒤에 . 또는 중간, 뒤에 * 금지.
// public suffix 제외
export const validUrl = (url: string | string[]): boolean => {
    if (Array.isArray(url)) return url.every(validUrl);
    return !url.startsWith('.') && !url.endsWith('.') && !url.endsWith('*') 
        && !(url.indexOf('.*.') !== -1) && !(url.indexOf('..') !== -1) 
        // public suffix 제외 (https://publicsuffix.org/list/public_suffix_list.dat)
        && !(url.indexOf('*.com') !== -1) && !(url.indexOf('*.co.kr') !== -1) 
        && !(url.indexOf('*.kr') !== -1) && !(url.indexOf('*.net') !== -1);
}

export default (l: string) => {
    // '*.realgrid.com,localhost,real-report.com' => ['*.realgrid.com', 'localhost', 'real-report.com']
    const urls = l.split(',').filter(Boolean);

    if (validUrl(urls)) {
        if (!dom) throw  new Error('Unknown host domain')
        return matchurl(dom, urls);
    } else return false;
}
