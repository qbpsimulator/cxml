"use strict";
// This file is part of cxml, copyright (c) 2015-2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
/** Type and member dependency helper. Implements Kahn's topological sort. */
var Item = (function () {
    function Item(kind, dependencyNum) {
        /** Track dependents for Kahn's topological sort algorithm. */
        this.dependentList = [];
        this.dependencyNum = dependencyNum;
        this.surrogateKey = kind.nextKey++;
    }
    Item.prototype.resolveDependency = function (specList) {
        if (this.dependencyNum) {
            this.setDependency(specList[this.dependencyNum]);
        }
    };
    /** Set parent type or substituted member. */
    Item.prototype.setDependency = function (dependency) {
        this.dependency = dependency;
        this.ready = false;
        if (dependency.ready) {
            // Entire namespace for substituted member is already fully defined,
            // so the substituted member's dependentList won't get processed any more
            // and we should process this member immediately.
            this.tryInit();
        }
        else if (dependency != this)
            dependency.dependentList.push(this);
    };
    Item.prototype.init = function () { };
    /** Topological sort visitor. */
    Item.prototype.tryInit = function () {
        if (!this.ready) {
            this.ready = true;
            this.init();
        }
        for (var _i = 0, _a = this.dependentList; _i < _a.length; _i++) {
            var dependent = _a[_i];
            dependent.tryInit();
        }
        this.dependentList = [];
    };
    /** Create types and members based on JSON specifications. */
    Item.initAll = function (pendingList) {
        for (var _i = 0, pendingList_1 = pendingList; _i < pendingList_1.length; _i++) {
            var spec = pendingList_1[_i];
            // If the spec has a parent, it handles defining the child.
            if (!spec.dependency || spec.dependency == spec) {
                spec.tryInit();
            }
        }
    };
    return Item;
}());
Item.nextKey = 0;
exports.Item = Item;
