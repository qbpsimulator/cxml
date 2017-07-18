import { NamespaceBase } from './NamespaceBase';
/** XML parser context, holding definitions of all imported namespaces. */
export declare class ContextBase<Namespace extends NamespaceBase<any>> {
    constructor(NamespaceType: {
        new (name: string, id: number, context: ContextBase<Namespace>): Namespace;
    });
    /** Look up namespace by name. */
    namespaceByName(name: string): Namespace;
    /** Look up namespace by internal numeric surrogate key. */
    namespaceById(id: number): Namespace;
    /** Create or look up a namespace by name in URI (URL or URN) format. */
    registerNamespace(name: string): Namespace;
    /** Copy a namespace from another context. */
    copyNamespace(other: NamespaceBase<any>): Namespace;
    /** Constructor for namespaces in this context. */
    private NamespaceType;
    /** Next available numeric surrogate key for new namespaces. */
    private namespaceKeyNext;
    /** List of namespaces indexed by a numeric surrogate key. */
    protected namespaceList: Namespace[];
    /** Table of namespaces by name in URI format (URL or URN).  */
    private namespaceNameTbl;
}
