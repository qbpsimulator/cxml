import { Namespace } from './Namespace';
import { MemberSpec } from './MemberSpec';
/** Tuple: member ID, flags, name */
export declare type RawRefSpec = [number | MemberSpec, number, string];
export declare const enum MemberRefFlag {
    optional = 1,
    array = 2,
}
export declare class MemberRef {
    constructor(member: MemberSpec, min: number, max: number);
    static parseSpec(spec: RawRefSpec, namespace: Namespace, proxy?: MemberRef): MemberRef;
    member: MemberSpec;
    min: number;
    max: number;
    prefix: string;
    safeName: string;
    proxy: MemberRef;
}
