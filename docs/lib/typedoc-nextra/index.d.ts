import { JSONOutput } from 'typedoc';

declare abstract class AbstractSerializer {
    declaration: JSONOutput.DeclarationReflection;
    constructor(declaration: JSONOutput.DeclarationReflection);
    serialize(): void;
}

declare function getName(decl: JSONOutput.DeclarationReflection): string;
declare function getFileMetadata(decl: JSONOutput.DeclarationReflection): FileMetadata | null;
interface FileMetadata {
    name: string;
    directory: string;
    line: number;
    url?: string;
}
declare function escape(src: string): string;
declare function parseType(t: JSONOutput.SomeType): string;
declare function parseTypes(t: JSONOutput.SomeType): string[];
declare function makeId(src: string, prefix?: string): string;

type HeadingTypes = 1 | 2 | 3 | 4 | 5 | 6;
type MdHeading<T extends string> = `# ${T}` | `## ${T}` | `### ${T}` | `#### ${T}` | `##### ${T}` | `###### ${T}`;
declare function heading<T extends string>(src: T): `# ${T}`;
declare function heading<T extends string>(src: T, type: 1): `# ${T}`;
declare function heading<T extends string>(src: T, type: 2): `## ${T}`;
declare function heading<T extends string>(src: T, type: 3): `### ${T}`;
declare function heading<T extends string>(src: T, type: 4): `#### ${T}`;
declare function heading<T extends string>(src: T, type: 5): `##### ${T}`;
declare function heading<T extends string>(src: T, type: 6): `###### ${T}`;
declare function headingId<T extends string, U extends string>(src: T, id: U, type?: HeadingTypes): `<h${HeadingTypes} id="${U}">${T}</h${HeadingTypes}>`;
declare function code<T extends string>(src: T): `\`${T}\``;
declare function codeBlock<T extends string, U extends string>(src: T, lang?: U): `\`\`\`\n${T}\n\`\`\`` | `\`\`\`${U}\n${T}\n\`\`\``;
declare function bold<T extends string>(src: T): `**${T}**`;
declare function italic<T extends string>(src: T): `*${T}*`;
declare function strikethrough<T extends string>(src: T): `~~${T}~~`;
declare function subscript<T extends string>(src: T): `~${T}~`;
declare function superscript<T extends string>(src: T): `^${T}^`;
declare function highlight<T extends string>(src: T): `==${T}==`;
declare function taskList<T extends string>(src: T): `[] ${T}`;
declare function taskList<T extends string>(src: T, checked?: false): `[] ${T}`;
declare function taskList<T extends string>(src: T, checked: true): `[x] ${T}`;
declare function blockquote<T extends string>(src: T): `> ${T}`;
declare function ul<T extends string>(src: T): `- ${T}`;
declare function ol<T extends string>(src: T): `${number}. ${T}`;
declare function hr(): "---";
declare function hyperlink<T extends string, U extends string>(text: T, link: U): `[${T}](${U})`;
declare function doclink(text: string): string;
declare function seelink(comment: any): string;
declare function image<T extends string, U extends string>(alt: T, link: U): `![${T}](${U})`;
declare function table(heading: string[], body: string[][]): string;

interface DocumentedClass {
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
    metadata: FileMetadata | null;
}
interface DocumentedClassConstructor extends DocumentedClassMethod {
    constructor: string;
}
interface DocumentedClassProperty {
    name: string;
    description: string | null;
    see: string[];
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
interface DocumentedParameter {
    name: string;
    description: string | null;
    optional: boolean;
    default: string | null;
    type: string | null;
    rawType: string[] | null;
}
interface DocumentedClassMethod {
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
declare class ClassSerializer extends AbstractSerializer {
    private _parseCommentLink;
    serialize(): DocumentedClass;
    parseProperties(decl: JSONOutput.DeclarationReflection): DocumentedClassProperty;
    parseMethod(decl: JSONOutput.DeclarationReflection): DocumentedClassMethod;
    parseParameter(decl: JSONOutput.TypeParameterReflection): DocumentedParameter;
}

interface DocumentedTypes {
    name: string;
    description: string | null;
    see: string[];
    private: boolean;
    deprecated: boolean;
    type: string | null;
    properties: DocumentedTypeProperty[];
    parameters: DocumentedParameter[];
    returns: {
        type: string;
        description: string | null;
    } | null;
    metadata: FileMetadata | null;
}
interface DocumentedTypeProperty extends DocumentedClassProperty {
    value: string | null;
}
declare class TypesSerializer extends AbstractSerializer {
    serialize(): DocumentedTypes;
}

type DocumentedFunction = DocumentedClassMethod;
declare class FunctionSerializer extends AbstractSerializer {
    serialize(): DocumentedFunction;
    parseParameter(decl: JSONOutput.TypeParameterReflection): DocumentedParameter;
}

interface TypeDocNextraMarkdownBuild {
    name: string;
    metadata: FileMetadata | null;
    content: string;
}
interface TypeDocNextraMdBuilderOptions {
    linker: (t: string, s: string[]) => string;
    links: TypeDocNextraLink;
}
declare class TypeDocNextra {
    options: TypeDocNextraMdBuilderOptions;
    linker: typeof this$1.options.linker;
    constructor(options: TypeDocNextraMdBuilderOptions);
    getSee(see: string[]): string;
    getClassHeading(c: DocumentedClass): string;
    getCtor(c: DocumentedClassConstructor): string;
    transformClass(classes: DocumentedClass[]): TypeDocNextraMarkdownBuild[];
    transformFunctions(types: DocumentedFunction[]): TypeDocNextraMarkdownBuild[];
    transformTypes(types: DocumentedTypes[]): TypeDocNextraMarkdownBuild[];
    getTypeMarkdown(t: DocumentedTypes): string;
    getMarkdown(c: DocumentedClass): string;
    getProperties(properties: DocumentedClassProperty[]): string;
    getMethods(methods: DocumentedClassMethod[]): string;
    getFunctions(m: DocumentedFunction): string;
}

type TypeDocNextraLink = Record<string, string>;
interface TypeDocNextraInit {
    jsonInputPath?: string | null;
    input?: string[] | null;
    jsonName?: string;
    output?: string;
    noEmit?: boolean;
    custom?: TypeDocNextraCustomFile[];
    tsconfigPath?: string;
    print?: boolean;
    spaces?: number;
    markdown?: boolean;
    noLinkTypes?: boolean;
    extension?: string;
    links?: TypeDocNextraLink;
}
interface TypeDocNextraCustomFile {
    name: string;
    path: string;
    category: string;
    type?: string;
}
interface DocumentationMetadata {
    timestamp: number;
    generationMs: number;
}
interface Documentation {
    custom: Record<string, (TypeDocNextraCustomFile & {
        content: string;
    })[]>;
    modules: Record<string, {
        name: string;
        classes: {
            markdown: TypeDocNextraMarkdownBuild[];
            data: DocumentedClass;
        }[];
        types: {
            markdown: TypeDocNextraMarkdownBuild[];
            data: DocumentedTypes;
        }[];
        functions: {
            markdown: TypeDocNextraMarkdownBuild[];
            data: DocumentedFunction;
        }[];
    }>;
    metadata: DocumentationMetadata;
}
declare function createDocumentation(options: TypeDocNextraInit): Promise<Documentation>;

export { AbstractSerializer, ClassSerializer, Documentation, DocumentationMetadata, DocumentedClass, DocumentedClassConstructor, DocumentedClassMethod, DocumentedClassProperty, DocumentedFunction, DocumentedParameter, DocumentedTypeProperty, DocumentedTypes, FileMetadata, FunctionSerializer, HeadingTypes, MdHeading, TypeDocNextra, TypeDocNextraCustomFile, TypeDocNextraInit, TypeDocNextraLink, TypeDocNextraMarkdownBuild, TypeDocNextraMdBuilderOptions, TypesSerializer, blockquote, bold, code, codeBlock, createDocumentation, createDocumentation as default, doclink, escape, getFileMetadata, getName, heading, headingId, highlight, hr, hyperlink, image, italic, makeId, ol, parseType, parseTypes, seelink, strikethrough, subscript, superscript, table, taskList, ul };
