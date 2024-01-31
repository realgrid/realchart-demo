import { DocumentedClass, DocumentedClassConstructor, DocumentedClassMethod, DocumentedClassProperty, DocumentedFunction, DocumentedTypes } from './serializers';
import { bold, code, codeBlock, heading, hyperlink, table } from './utils/md';
import { FileMetadata, escape } from './utils';
import { TypeDocNextraLink } from '.';

export interface TypeDocNextraMarkdownBuild {
    name: string;
    metadata: FileMetadata | null;
    content: string;
}

export interface TypeDocNextraMdBuilderOptions {
    linker: (t: string, s: string[]) => string;
    links: TypeDocNextraLink;
}

export class TypeDocNextra {
    public linker: typeof this.options.linker;
    public constructor(public options: TypeDocNextraMdBuilderOptions) {
        this.linker = this.options.linker;
    }

    // [
    //     ' - ',
    //     '[Factorial - Wikipedia](https://en.wikipedia.org/wiki/Factorial)',
    //     '\n',
    //     ' - ',
    //     'semifactorial',
    //     '\n',
    // ]
    public getSee(see: string[]) {
        
        /**
         * console.debug(see);
         * [
            ' - ',
            '[RcCircleGauge](#RcCircleGauge)',
            '\n',
            ' - ',
            '[RcBulletGauge](#RcBulletGauge)',
            '\n'
            ]
         */
        
        return see?.length 
            ? `\n${heading('See Also', 3)}\n${see.map((s, i) => i % 3 == 1 ? heading(s, 4) : s).join('')}`
            : '';
    }

    public getClassHeading(c: DocumentedClass) {
        // const derived = `${c.extends ? ` extends ${this.linker(c.extends, [c.extends])}` : ''}${c.implements ? ` implements ${this.linker(c.implements, [c.implements])}` : ''}`;
        const exts = c.extends ? `${heading('Extends', 3)}\n${'- ' + hyperlink(c.extends, '../classes/' + c.extends)}` : '';
        const imps = c.implements ? `${heading('Implements', 3)}\n${'- ' + hyperlink(c.implements, '../classes/' + c.implements)}` : '';

        return [heading(escape(c.name), 2),
            exts,
            imps,
            c.description ? `\n${c.description}\n` : '',
            this.getSee(c.see),
            c.fiddle.join(' ')]
        .map(v => v?.trim()).filter(v=>v).join('\n\r');
    }

    public getCtor(c: DocumentedClassConstructor) {
        if (!c) return '';

        const ctor = codeBlock(
            `${escape(c.constructor)}(${c.parameters
                .filter((p) => !p.name.includes('.'))
                .map((m) => m.name)
                .join(', ')})`,
            'typescript'
        );

        if (c.parameters.length) {
            const tableHead = [
                'Parameter', 
                'Type', 
                // 'Optional',
            ];
            if (c.parameters.some((p) => p.description && p.description.trim().length > 0)) tableHead.push('Description');
            const tableBody = c.parameters.map((m) => {
                const params = [
                    escape(m.name), 
                    this.linker(m.type || 'any', [m.type || 'any']),
                    // m.optional ? '✅' : '❌',
                ];

                if (tableHead.includes('Description')) params.push(m.description || 'N/A');

                return params;
            });

            return `\n${ctor}\n${table(tableHead, tableBody)}\n`;
        }

        return `\n${ctor}\n`;
    }

    public transformClass(classes: DocumentedClass[]): TypeDocNextraMarkdownBuild[] {
        return classes.map((c) => {
            return {
                name: c.name,
                metadata: c.metadata,
                content: this.getMarkdown(c)
            };
        });
    }

    public transformFunctions(types: DocumentedFunction[]): TypeDocNextraMarkdownBuild[] {
        return types.map((t) => {
            return {
                name: t.name,
                metadata: t.metadata,
                content: this.getFunctions(t)
            };
        });
    }

    public transformTypes(types: DocumentedTypes[]): TypeDocNextraMarkdownBuild[] {
        return types.map((t) => {
            return {
                name: t.name,
                metadata: t.metadata,
                content: this.getTypeMarkdown(t)
            };
        });
    }

    public getTypeMarkdown(t: DocumentedTypes) {
        return [
            heading(escape(t.name), 2),
            t.description ? '\n' + t.description : '',
            t.deprecated ? `\n- ${bold('⚠️ Deprecated')}` : '',
            t.properties.length
                ? (() => {
                      const tableHead = ['Property', 'Type', 'Value'];
                      if (t.properties.some((p) => p.description && p.description.trim().length > 0)) tableHead.push('Description');
                      const tableBody = t.properties.map((n) => {
                          const params = [escape(n.name), this.linker(n.type || 'any', [n.type || 'any']), escape(n.value || 'N/A')];

                          if (tableHead.includes('Description')) { 
                            params.push(n.description?.replace(/\\n/g, '<br/>').replace(/\\/g, '<br/>') || 'N/A');
                          }

                          return params;
                      });

                      return `\n${table(tableHead, tableBody)}\n`;
                  })()
                : t.type
                ? `\n- Type: ${this.linker(t.type, [t.type])}`
                : '',
            t.metadata?.url ? `\n- ${hyperlink('Source', t.metadata.url)}` : ''
        ]
            .filter((r) => r.length > 0)
            .join('\n')
            .trim();
    }

    public getMarkdown(c: DocumentedClass) {
        // c.properties.forEach(p => { p.metadata = { name: c.name, directory: '', line: 0 }; } );
        return [this.getClassHeading(c), this.getCtor(c.constructor!), this.getConfigProperties(c.configProperties), this.getProperties(c.properties), this.getMethods(c.methods)].join('\n\n');
    }

    // config props를 테이블로 표현
    public getConfigProperties(properties: any[]) {
        if (!properties.length) return '';

        const head = heading('Config Properties', 2);
        const cols = ['Name', 'Type', 'Description'];
        const tableCols = ['', ...cols, ''].join(' | ');
        const seperator = ['', ...Array(cols.length).fill('---'), ''].join(' | ');
        const tableHead = [tableCols, seperator].join('  \n');
        const tableBody = properties.map((p) => {
            const pname = escape(p.name).trim();
            // pipe가 특수문자로 사용되지 않도록 한다.
            const ptype = (p.type || p.dtype.name).replace(/\|/g, '\\|');
            // 개행문자가 다음 셀로 넘어가지 않도록, 띄어쓰기로 변경한다.
            const desc = p.content?.replace(/\n/g, ' ').trim() || '';
            return ['', `[${pname}](/config/config/${p.link})`, `\`${ptype}{:js}\``, desc, ''].join(' | ');
        });
        
        // const body = properties.map((m) => {
        //     // const name = `${m.private ? 'private' : 'public'} ${m.static ? 'static ' : ''}${escape(m.name)}`.trim();
        //     const ename = escape(m.name);
        //     const name = `${m.static ? 'static ' : ''}${m.readonly ? '*`<readonly>`* ' : ''}${ename}`.trim();
        //     /** @TODO: properties와 중복될 수 있음. #이름 다르게 처리. */
        //     const title = heading(`${name}: \`${m.type || m.dtype.name}{:js}\``, 3)
        //         + `[#${ename}]`;
        //     const desc = m.content?.trim() || '';

        //     return `${title}\n${desc}\n${this.getSee(m.see)}`;
        // });

        return `${head}\n${tableHead}\n${tableBody.join('  \n')}`.trim();
    }

    public getProperties(properties: DocumentedClassProperty[]) {
        if (!properties.length) return '';

        const head = heading('Properties', 2);
        const body = properties.map((m) => {
            // const name = `${m.private ? 'private' : 'public'} ${m.static ? 'static ' : ''}${escape(m.name)}`.trim();
            const ename = escape(m.name);
            const name = `${m.static ? 'static ' : ''}${m.readonly ? '*`<readonly>`* ' : ''}${ename}`.trim();
            const title = heading(`${name}: ${this.linker(m.type || 'any', m.rawType || [m.type || 'any'])}`, 3)
                + `[#${ename}]`;
            const desc = [m.description || '', m.deprecated ? `\n- ${bold('⚠️ Deprecated')}` : '', m.metadata?.url ? `\n- ${hyperlink('Source', m.metadata.url)}` : '']
                .filter((r) => r.length > 0)
                .join('\n')
                .trim();

            return [
                title,
                desc,
                this.getSee(m.see),
                m.fiddle.join(' ')
            ].map(v => v?.trim()).filter(v=>v).join('\n');
            // return `${title}\n${desc}\n${this.getSee(m.see)}\n${m.fiddle.join(' ')}`.trim();
        });

        return `${head}\n${body.join('\n')}`;
    }

    public getMethods(methods: DocumentedClassMethod[]) {
        if (!methods.length) return '';

        const head = heading('Methods', 2);
        const body = methods.map((m) => {
            const ename = escape(m.name);
            // ${m.private ? 'private' : 'public'}
            const name = `${m.static ? 'static ' : ''}${ename}(${m.parameters
                .filter((r) => !r.name.includes('.'))
                .map((m) => {
                    return `${m.name}${m.optional ? '?' : ''}`;
                })
                .join(', ')})`.trim();
            const title = heading(`${name}: ${m.returns?.type ? `${this.linker(m.returns.type || 'any', m.returns.rawType || ['any'])}` : 'any'}`, 3)
                + `[#${ename}]`;
            const desc = [
                m.description || '',
                m.deprecated ? `\n- ${bold('⚠️ Deprecated')}` : '',
                m.examples ? '\n' + m.examples.map((m) => (m.includes('```') ? m : codeBlock(m, 'typescript'))).join('\n\n') : '',
                m.parameters.length
                    ? (() => {
                          const tableHead = [
                            'Parameter', 
                            'Type', 
                            // 'Optional',
                        ];
                          if (m.parameters.some((p) => p.description && p.description.trim().length > 0)) tableHead.push('Description');
                          
                          const tableBody = m.parameters.map((n) => {
                              const params = [
                                    n.default ? `${escape(n.name)}=${code(n.default)}` : escape(n.name), 
                                    this.linker(n.type || 'any', n.rawType || [ n.type || 'any']),
                                    //   n.optional ? '✅' : '❌'
                              ];

                              if (tableHead.includes('Description')) params.push(n.description || 'N/A');

                              return params;
                          });

                          return `\n${table(tableHead, tableBody)}\n`;
                      })()
                    : '',
                m.metadata?.url ? `\n- ${hyperlink('Source', m.metadata.url)}` : '']
                .filter((r) => r.length > 0)
                .join('\n')
                .trim();

            return [
                title,
                desc,
                this.getSee(m.see),
                m.fiddle.join(' ')
            ].map(v => v.trim()).filter(v=>v).join('\n');
        });

        return `${head}\n${body.join('\n')}`;
    }

    public getFunctions(m: DocumentedFunction) {
        const ename = escape(m.name);
        const name = `${ename}(${m.parameters
            .filter((r) => !r.name.includes('.'))
            .map((m) => {
                return `${m.name}${m.optional ? '?' : ''}`;
            })
            .join(', ')})`.trim();
        const title = heading(`${name}: ${m.returns?.type ? `${this.linker(m.returns.type || 'any', m.returns.rawType || ['any'])}` : 'any'}`, 3)
            + `[#${ename}]`;
        const desc = [
            m.description || '',
            m.deprecated ? `\n- ${bold('⚠️ Deprecated')}` : '',
            m.examples ? '\n' + m.examples.map((m) => (m.includes('```') ? m : codeBlock(m, 'typescript'))).join('\n\n') : '',
            m.parameters.length
                ? (() => {
                      const tableHead = ['Parameter', 
                        'Type', 
                        // 'Optional',
                    ];
                      if (m.parameters.some((p) => p.description && p.description.trim().length > 0)) tableHead.push('Description');
                      const tableBody = m.parameters.map((n) => {
                        const params = [
                            n.default ? `${escape(n.name)}=${code(n.default)}` : escape(n.name), 
                            this.linker(n.type || 'any', n.rawType || [ n.type || 'any']), 
                            // n.optional ? '✅' : '❌',
                        ];

                          if (tableHead.includes('Description')) params.push(n.description || 'N/A');

                          return params;
                      });

                      return `\n${table(tableHead, tableBody)}\n`;
                  })()
                : '',
            m.metadata?.url ? `\n- ${hyperlink('Source', m.metadata.url)}` : ''
        ]
            .filter((r) => r.length > 0)
            .join('\n')
            .trim();

        return `${title}\n${desc}`;
    }
}
