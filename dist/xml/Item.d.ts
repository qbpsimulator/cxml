export interface ItemType {
    new (...args: any[]): Item;
    nextKey: number;
}
/** Type and member dependency helper. Implements Kahn's topological sort. */
export declare class Item {
    constructor(kind: ItemType, dependencyNum?: number);
    resolveDependency(specList: Item[]): void;
    /** Set parent type or substituted member. */
    setDependency(dependency: Item): void;
    init(): void;
    /** Topological sort visitor. */
    tryInit(): void;
    /** Create types and members based on JSON specifications. */
    static initAll(pendingList: Item[]): void;
    surrogateKey: number;
    static nextKey: number;
    /** Number of parent type or substituted member. */
    dependencyNum: number;
    /** Parent type or substituted member. */
    dependency: Item;
    /** Track dependents for Kahn's topological sort algorithm. */
    private dependentList;
    /** Visited flag for topological sort. */
    ready: boolean;
}
