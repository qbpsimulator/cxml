import { TypeSpec } from './TypeSpec';
import { MemberSpec } from './MemberSpec';
import { Context } from './Context';
import { NamespaceBase } from './NamespaceBase';
export interface ModuleExports {
    [name: string]: any;
    _cxml: [Namespace];
}
export interface ImportContent {
    typeTbl: {
        [key: string]: TypeSpec;
    };
    memberTbl: {
        [key: string]: MemberSpec;
    };
}
/** Tuple: module exports object, list of imported type names */
export declare type ImportSpec = [ModuleExports, string[], string[]];
export declare class Namespace extends NamespaceBase<Context> {
    init(importSpecList: ImportSpec[]): this;
    addType(spec: TypeSpec): void;
    addMember(spec: MemberSpec): void;
    typeByNum(num: number): TypeSpec;
    memberByNum(num: number): MemberSpec;
    link(): void;
    exportTypes(exports: ModuleExports): void;
    exportDocument(exports: ModuleExports): void;
    /** Get an internally used arbitrary prefix for fully qualified names
      * in this namespace. */
    getPrefix(): string;
    /** Invisible document element defining the types of XML file root elements. */
    doc: TypeSpec;
    importSpecList: ImportSpec[];
    importNamespaceList: Namespace[];
    exportTypeNameList: string[];
    /** All types used in the document. */
    typeSpecList: TypeSpec[];
    /** All members used in the document. */
    memberSpecList: MemberSpec[];
    exportOffset: number;
    exportTypeTbl: {
        [name: string]: TypeSpec;
    };
    exportMemberTbl: {
        [name: string]: MemberSpec;
    };
}
