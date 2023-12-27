import { stripIndents } from 'common-tags';
import { RealChartLinksFactory } from './links';
import path from 'path';

export type HeadingTypes = 1 | 2 | 3 | 4 | 5 | 6;
export type MdHeading<T extends string> = `# ${T}` | `## ${T}` | `### ${T}` | `#### ${T}` | `##### ${T}` | `###### ${T}`;

export function heading<T extends string>(src: T): `# ${T}`;
export function heading<T extends string>(src: T, type: 1): `# ${T}`;
export function heading<T extends string>(src: T, type: 2): `## ${T}`;
export function heading<T extends string>(src: T, type: 3): `### ${T}`;
export function heading<T extends string>(src: T, type: 4): `#### ${T}`;
export function heading<T extends string>(src: T, type: 5): `##### ${T}`;
export function heading<T extends string>(src: T, type: 6): `###### ${T}`;
export function heading<T extends string>(src: T, type: HeadingTypes = 1): MdHeading<T> {
    return `${'#'.repeat(type)} ${src}` as `# ${T}`;
}

export function headingId<T extends string, U extends string>(src: T, id: U, type: HeadingTypes = 1): `<h${HeadingTypes} id="${U}">${T}</h${HeadingTypes}>` {
    return `<h${type} id="${id}">${src}</h${type}>`;
}

export function code<T extends string>(src: T) {
    return `\`${src}\`` as const;
}

export function codeBlock<T extends string, U extends string>(src: T, lang?: U) {
    return `\`\`\`${lang || ''}\n${src}\n\`\`\`` as const;
}

export function bold<T extends string>(src: T) {
    return `**${src}**` as const;
}

export function italic<T extends string>(src: T) {
    return `*${src}*` as const;
}

export function strikethrough<T extends string>(src: T) {
    return `~~${src}~~` as const;
}

export function subscript<T extends string>(src: T) {
    return `~${src}~` as const;
}

export function superscript<T extends string>(src: T) {
    return `^${src}^` as const;
}

export function highlight<T extends string>(src: T) {
    return `==${src}==` as const;
}

export function taskList<T extends string>(src: T): `[] ${T}`;
export function taskList<T extends string>(src: T, checked?: false): `[] ${T}`;
export function taskList<T extends string>(src: T, checked: true): `[x] ${T}`;
export function taskList<T extends string>(src: T, checked = false) {
    return `[${checked ? 'x' : ''}] ${src}` as const;
}

export function blockquote<T extends string>(src: T) {
    return `> ${src}` as const;
}

export function ul<T extends string>(src: T) {
    return `- ${src}` as const;
}

export function ol<T extends string>(src: T): `${number}. ${T}` {
    return `1. ${src}`;
}

export function hr() {
    return `---` as const;
}

export function hyperlink<T extends string, U extends string>(text: T, link: U) {
    return `[${text}](${link})` as const;
}

export function doclink(text: string, vars: any = {}): string {
    /**
     * 'rc.RcChartControl label'
     * =>
     * keyword: rc.RcChartControl
     * sep: rc
     * keys: [RcChartControl]
     */
    const [keyword, ...display] = text.trim().split(' ');
    const [sep, ...keys] = keyword.split('.');
    const label = display.join(' ');
    const subpaths = ['config', 'docs', 'demo', 'guide'];
    let lastKey = keys.length ? keys.slice(-1)[0] : keyword;
    let page = '';
    // subroot page
    if (!keys.length && subpaths.includes(keyword)) {
        page = `/${keyword}`
    } 
    // self.property
    else if (!keyword.startsWith('Rc') && keyword == sep) {
        page = `#${keyword}`;
    } 
    else {
        // class link의 경우와 동일하게 처리할지 class는 A.Property 로 고정됨.
        // config는 a.b#property
        switch (sep) {
            case 'g':
            case 'global':
                page = `/docs/api/globals/${[keys]}`;
                break;
            case 'config':
                keys.forEach((k, i) => {
                    keys[i] = k[0] === '$' ? vars[k.substring(1)] || '$' : k;
                })
                if (keys.some(k => k === '$')) {
                    console.warn('[WARN] not found var', text);
                    return label;
                }
                // config에서는 #이 있으면 속성
                lastKey = lastKey.split('#').slice(-1)[0];
                page = '/config/config/' + keys.join('/');
                break;
            case 'demo':
            case 'guide':
                page = `/${sep}/` + keys.join('/');
                break;
            case 'rc':
            case 'realchart':
            default:
                const [cls, prop] = keys.length ? keys : [keyword];
                page = `/docs/api/classes/${cls}${prop ? '#' + prop : ''}`;
        }
    }
    
    return hyperlink(label || lastKey , page);
}

export function fiddlelink(comment: any): string {
    if ((comment.tag  != '@fiddle')) return comment.text;

    const [{text}] = comment.content;
    const [src, ...label] = text.split(' ');
    const href = path.join(RealChartLinksFactory['JSFIDDLE'], src);
    return `<FiddleLink label="${label.join(' ')}" href="${href}"/>`;
}

export function seelink(comment:any): string {
    if (!(comment.kind == 'inline-tag') || !(comment.tag  == '@link')) return comment.text;
    
    return doclink(comment.text);
}

export function image<T extends string, U extends string>(alt: T, link: U) {
    return `![${alt}](${link})` as const;
}

export function table(heading: string[], body: string[][]) {
    return stripIndents`| ${heading.join(' | ')} |
    | ${heading.map(() => '-'.repeat(11)).join(' | ')} |
    ${body.map((m) => `| ${m.join(' | ').replace(/\n/g, ' ')} |`).join('\n')}`;
}
