import { NamespaceBase } from './NamespaceBase';
import { Rule } from '../parser/Rule';
import { TypeSpec } from './TypeSpec';
import { MemberRef } from './MemberRef';
import { Item } from './Item';
/** Tuple: name, type ID list, flags, substituted member ID */
export declare type RawMemberSpec = [string, number[], number, number];
export declare const enum MemberFlag {
    abstract = 1,
    substituted = 2,
    any = 4,
}
/** Represents a child element or attribute. */
export declare class MemberSpec extends Item {
    constructor(name: string, dependencyNum?: number);
    static parseSpec(spec: RawMemberSpec, namespace: NamespaceBase<any>): MemberSpec;
    init(): void;
    getRef(): MemberRef;
    getProxy(TypeSpec: any): any;
    name: string;
    namespace: NamespaceBase<any>;
    safeName: string;
    isAbstract: boolean;
    isSubstituted: boolean;
    typeNum: number;
    typeSpecList: TypeSpec[];
    rule: Rule;
    substitutes: MemberSpec;
    /** Substitution group virtual type,
      * containing all possible substitutes as children. */
    proxySpec: TypeSpec;
    /** All types containing this member, to be modified if more substitutions
      * for this member are declared later. */
    containingTypeList: {
        type: TypeSpec;
        head: MemberRef;
        proxy: MemberRef;
    }[];
    comment: string;
    isExported: boolean;
}
