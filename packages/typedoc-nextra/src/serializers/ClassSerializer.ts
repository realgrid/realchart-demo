import { JSONOutput, ReflectionKind } from 'typedoc';
import { FileMetadata, getFileMetadata, getName, hyperlink, seelink, parseType, parseTypes, getVars, getDescription, getDocLinkedDesc } from '../utils';
import { AbstractSerializer } from './AbstractSerializer';
import { TypeDocParameterReflection } from '..';

export interface DocumentedClass {
    name: string;
    description: string | null;
    see: string[];
    extends: string | null;
    rawExtends: string[] | null;
    implements: string | null;
    rawImplements: string[] | null;
    private: boolean;
    abstract: boolean;
    deprecated: boolean;
    constructor: DocumentedClassConstructor | null;
    methods: DocumentedClassMethod[];
    properties: DocumentedClassProperty[];
    configProperties: any[];
    metadata: FileMetadata | null;
    vars: any[] | undefined;
}

export interface DocumentedClassConstructor extends DocumentedClassMethod {
    constructor: string;
}

export interface DocumentedClassProperty {
    name: string;
    description: string | null;
    see: string[];
    vars?: any;
    static: boolean;
    private: boolean;
    readonly: boolean;
    abstract: boolean;
    deprecated: boolean;
    default: string | null;
    type: string | null;
    rawType: string[] | null;
    metadata: FileMetadata | null;
}

export interface DocumentedParameter {
    name: string;
    description: string | null;
    optional: boolean;
    default: string | null;
    type: string | null;
    rawType: string[] | null;
}

export interface DocumentedClassMethod {
    name: string;
    description: string | null;
    see: string[];
    static: boolean;
    private: boolean;
    examples: string[];
    abstract: boolean;
    deprecated: boolean;
    parameters: DocumentedParameter[];
    returns: {
        type: string;
        rawType: string[] | null;
        description: string | null;
    } | null;
    metadata: FileMetadata | null;
}

export class ClassSerializer extends AbstractSerializer {

    constructor(public declaration: JSONOutput.DeclarationReflection, private config: any = {}) {
        super(declaration);
    }

    public serialize(): DocumentedClass {
        const ctor = this.declaration.children?.find((c) => {
            return c.kind === ReflectionKind.Constructor;
        });
        const properties = this.declaration.children?.filter((c) => {
            return c.kind === ReflectionKind.Property || c.kind === ReflectionKind.Accessor;
        });
        const methods = this.declaration.children?.filter((c) => {
            return c.kind === ReflectionKind.Method;
        });

        const ctorSig = ctor?.signatures?.find((r) => r.kind === ReflectionKind.ConstructorSignature);

        const vars = getVars(this.declaration);
        const description = getDescription(this.declaration, vars);
        const name = getName(this.declaration);
        return {
            name,
            abstract: this.declaration.flags.isAbstract || !!this.declaration.comment?.blockTags?.some((r) => r.tag === '@abstract'),
            constructor: ctor
                ? {
                      ...this.parseMethod(ctor),
                      name: (ctorSig?.type as any)?.name || this.declaration.name || ctor.name,
                      constructor: ctorSig?.name || `new ${(ctorSig?.type as any)?.name || this.declaration.name || ctor.name}`
                  }
                : null,
            metadata: getFileMetadata(this.declaration),
            deprecated: !!this.declaration.comment?.blockTags?.some((r) => r.tag === '@deprecated'),
            description,
            vars,
            extends: this.declaration.extendedTypes?.length ? parseType(this.declaration.extendedTypes[0]) : null,
            implements: this.declaration.implementedTypes?.length ? parseType(this.declaration.implementedTypes[0]) : null,
            rawExtends: this.declaration.extendedTypes?.length ? parseTypes(this.declaration.extendedTypes[0]) : null,
            rawImplements: this.declaration.implementedTypes?.length ? parseTypes(this.declaration.implementedTypes[0]) : null,
            methods: methods?.map((m) => this.parseMethod(m)) || [],
            private: this.declaration.flags.isPrivate || !!this.declaration.comment?.blockTags?.some((r) => r.tag === '@private'),
            properties: properties?.map((m) => this.parseProperties(m)) || [],
            configProperties: this.parseConfigProperties(name) || [],
            see: this.declaration.comment?.blockTags?.find((r) => r.tag === '@see')?.content?.map((m) => seelink(m)) || []
        };
    }

    public parseConfigProperties(name: string): any[] {
        const seriesRegex = /Rc(?!Chart).*Series(Group)?/;
        const gaugeRegex = /Rc(?!Chart).*Gauge(Group)?(?!Base)/;
        const [series] = seriesRegex.exec(name) || [];
        const [gauge] = gaugeRegex.exec(name) || [];
        const key = name.slice(2)

        if (series || gauge) {
            // DocumentReflection?
            const { props } = this.config[key] || {};
            return props?.map((p: any) => {
                return {
                    ...p,
                    content: p.content?.split('\\').shift() ?? ''
                };
            }) || [];
        }

        return [];
    }

    public parseProperties(decl: JSONOutput.DeclarationReflection): DocumentedClassProperty {
        const vars = getVars(this.declaration);
        const description = getDescription(decl, vars);
        const base = {
            abstract: decl.flags.isAbstract || !!decl.comment?.blockTags?.some((r) => r.tag === '@abstract'),
            default: decl.defaultValue || decl.comment?.blockTags?.find((r) => r.tag === '@default')?.content?.[0].text || null,
            deprecated: !!decl.comment?.blockTags?.some((r) => r.tag === '@deprecated'),
            description,
            metadata: getFileMetadata(decl),
            name: decl.name,
            private: decl.flags.isPrivate || !!decl.comment?.blockTags?.some((r) => r.tag === '@private'),
            readonly: decl.flags.isReadonly || !!decl.comment?.blockTags?.some((r) => r.tag === '@readonly'),
            see: decl.comment?.blockTags?.find((r) => r.tag === '@see')?.content?.map((m) => seelink(m)) || [],
            vars,
            static: decl.flags.isStatic || !!decl.comment?.blockTags?.some((r) => r.tag === '@static'),
            type: decl.type ? parseType(decl.type) : 'any'
        } as DocumentedClassProperty;

        if (decl.kind === ReflectionKind.Accessor) {
            const getter = decl.getSignature;
            if (!getter) throw new Error(`Accessor ${decl.name} does not have a getter`);

            const setter = decl.setSignature != null;
            if (!setter) base.readonly = true;

            return Object.assign(base, {
                abstract: getter.flags.isAbstract || getter.comment?.blockTags?.some((r) => r.tag === '@abstract'),
                deprecated: getter.comment?.blockTags?.some((r) => r.tag === '@deprecated'),
                description: getDescription(getter, vars),
                metadata: getFileMetadata(getter as unknown as JSONOutput.DeclarationReflection),
                name: getter.name,
                private: getter.flags.isPrivate || getter.comment?.blockTags?.some((r) => r.tag === '@private'),
                readonly: getter.flags.isReadonly || getter.comment?.blockTags?.some((r) => r.tag === '@readonly'),
                see: getter.comment?.blockTags?.filter((r) => r.tag === '@see').map((m) => m.content.map((t) => seelink(t)).join('')),
                static: getter.flags.isStatic || getter.comment?.blockTags?.some((r) => r.tag === '@static'),
                type: getter.type ? parseType(getter.type) : 'any'
            } as Partial<DocumentedClassProperty>);
        }

        return base;
    }

    public parseMethod(decl: JSONOutput.DeclarationReflection): DocumentedClassMethod {
        const signature = decl.signatures?.[0] || decl;
        const description = getDescription(signature);
        return {
            name: decl.name,
            description,
            see: signature.comment?.blockTags?.filter((r) => r.tag === '@see').map((t) => t.content.map((t) => seelink(t)).join('')) || [],
            static: !!signature.flags.isStatic || !!decl.flags.isStatic,
            private: decl.flags.isPrivate || !!signature.comment?.blockTags?.filter((r) => r.tag === '@private').length,
            examples: signature.comment?.blockTags?.filter((r) => r.tag === '@example').map((t) => t.content.map((t) => t.text).join('')) || [],
            abstract: decl.flags.isAbstract || !!signature.comment?.blockTags?.some((r) => r.tag === '@abstract'),
            deprecated: !!signature.comment?.blockTags?.some((r) => r.tag === '@deprecated'),
            parameters: (signature as any).parameters?.map((m: any) => this.parseParameter(m)) || ((decl as any).parameters || decl.typeParameters)?.map((m: any) => this.parseParameter(m)) || [],
            returns: {
                type: signature.type ? parseType(signature.type) : 'any',
                rawType: signature.type ? parseTypes(signature.type) : ['any'],
                description:
                    signature.comment?.blockTags
                        ?.find((r) => r.tag === '@returns')
                        ?.content?.map(getDocLinkedDesc)
                        .join('') || null
            },
            metadata: getFileMetadata(decl)
        };
    }

    public parseParameter(decl: TypeDocParameterReflection): DocumentedParameter {
        return {
            name: decl.name,
            description:
                decl.comment?.summary
                    ?.map(getDocLinkedDesc)
                    .join('')
                    .trim() || null,
            optional: !!decl.flags.isOptional,
            default: (decl.default as any)?.name 
                || decl.comment?.blockTags?.find((r) => r.tag === '@default')?.content[0].text 
                || decl.defaultValue as string
                || null,
            type: decl.type ? parseType(decl.type) : 'any',
            rawType: decl.type ? parseTypes(decl.type) : ['any']
        };
    }
}
