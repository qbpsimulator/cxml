import { ContextBase } from './ContextBase';
export declare class NamespaceBase<Context extends ContextBase<any>> {
    constructor(name: string, id: number, context: Context);
    addType(spec: any): void;
    typeByNum(spec: any): any;
    getPrefix(): string;
    initFrom(other: NamespaceBase<any>): void;
    static sanitize(name: string): string;
    /** URI identifying the namespace (URN or URL which doesn't need to exist). */
    name: string;
    /** Surrogate key, used internally as a unique namespace ID. */
    id: number;
    /** Parser context that uses this namespace. */
    context: Context;
    /** URL address where main schema file was downloaded. */
    schemaUrl: string;
    /** Example short name for this namespace. */
    short: string;
}
