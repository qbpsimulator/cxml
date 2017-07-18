import { Namespace } from './Namespace';
import { MemberSpec } from './MemberSpec';
import { MemberRef, RawRefSpec } from './MemberRef';
import { Rule, RuleClass, Member } from '../parser/Rule';
import { Item } from './Item';
/** Tuple: flags, parent type ID, child element list, attribute list.
  * Serialized JSON format. */
export declare type RawTypeSpec = [number, number, RawRefSpec[], RawRefSpec[]];
/** Parse name from schema in serialized JSON format.
  * If name used in XML is not a valid JavaScript identifier, the schema
  * definition will be in format <cleaned up name for JavaScript>:<XML name>. */
export declare function parseName(name: string): {
    name: string;
    safeName: string;
};
/** Represents the prototype of RuleClass.
  * Contains placeholders for any missing members. */
export interface RuleMembers {
    [name: string]: Member | Member[];
}
export declare const enum TypeFlag {
    /** Type contains text that gets parsed to JavaScript primitives. */
    primitive = 1,
    /** Type only contains text, no wrapper object is needed to hold its attributes. */
    plainPrimitive = 2,
    /** Type contains text with a list of whitespace-separated items. */
    list = 4,
}
/** Type specification defining attributes and children. */
export declare class TypeSpec extends Item {
    constructor(name?: string, namespace?: Namespace, spec?: RawTypeSpec);
    getProto(): RuleClass;
    getType(): Rule;
    init(): Rule;
    private defineMember(ref);
    getSubstitutes(): MemberSpec[];
    defineMembers(): void;
    addSubstitutes(headRef: MemberRef, proxy: MemberRef): void;
    addChild(memberRef: MemberRef, proxy?: MemberRef): void;
    addSubstitute(head: MemberSpec, substitute: MemberSpec): void;
    addMixin(spec: TypeSpec): void;
    /** Remove placeholders from instance prototype. They allow dereferencing
      * contents of missing optional child elements without throwing errors.
      * @param strict Also remove placeholders for mandatory child elements. */
    cleanPlaceholders(strict?: boolean): void;
    private static addSubstituteToProxy(substitute, type, head?);
    private static addSubstitutesToProxy(member, type);
    namespace: Namespace;
    name: string;
    safeName: string;
    flags: number;
    childSpecList: RawRefSpec[];
    attributeSpecList: RawRefSpec[];
    substituteList: MemberSpec[];
    /** Other types added as mixins. */
    mixinList: TypeSpec[];
    optionalList: string[];
    requiredList: string[];
    isProxy: boolean;
    /** For an anonymous type, the member (of another type) that it defines.
      * Used for giving the type a descriptive name. */
    containingType: TypeSpec;
    containingRef: MemberRef;
    comment: string;
    private rule;
    private proto;
    private placeHolder;
}
