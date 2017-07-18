import { Namespace } from '../xml/Namespace';
import { Rule, HandlerInstance } from './Rule';
import { MemberRef } from '../xml/MemberRef';
/** Parser state created for each input tag. */
export declare class State {
    constructor(parent: State | null, memberRef: MemberRef, type: Rule, item: HandlerInstance, namespaceTbl: {
        [short: string]: [Namespace, string];
    });
    parent: State | null;
    /** Tag metadata in schema, defining name and occurrence count. */
    memberRef: MemberRef;
    /** Tag type in schema, defining attributes and children. */
    rule: Rule;
    /** Output object for contents of this tag. */
    item: HandlerInstance;
    /** Text content found inside the tag. */
    textList: string[];
    /** Recognized xmlns prefixes. */
    namespaceTbl: {
        [short: string]: [Namespace, string];
    };
}
