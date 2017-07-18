import { Namespace, ModuleExports } from './Namespace';
import { RawTypeSpec } from './TypeSpec';
import { RawMemberSpec } from './MemberSpec';
import { ContextBase } from './ContextBase';
/** XML parser context, holding definitions of all imported namespaces. */
export declare class Context extends ContextBase<Namespace> {
    constructor();
    /** Mark a namespace as seen and add it to list of pending namespaces. */
    markNamespace(exportObj: ModuleExports): void;
    /** Parse types from schema in serialized JSON format. */
    registerTypes(namespace: Namespace, exportTypeNameList: string[], rawTypeSpecList: RawTypeSpec[]): void;
    /** Parse members from schema in serialized JSON format. */
    registerMembers(namespace: Namespace, rawMemberSpecList: RawMemberSpec[]): void;
    /** Process namespaces seen so far. */
    process(): void;
    /** Remove temporary structures needed to define new handlers. */
    cleanPlaceholders(strict?: boolean): void;
    /** List of pending namespaces (not yet registered or waiting for processing). */
    private pendingNamespaceList;
    /** Grows with pendingNamespaceList and shrinks when namespaces are registered.
      * When zero, all pending namespaces have been registered and can be processed. */
    private pendingNamespaceCount;
    private pendingTypeList;
    private pendingMemberList;
    private typeList;
}
