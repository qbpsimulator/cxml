"use strict";
// This file is part of cxml, copyright (c) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
/** Parser state created for each input tag. */
var State = (function () {
    function State(parent, memberRef, type, item, namespaceTbl) {
        this.parent = parent;
        this.memberRef = memberRef;
        this.rule = type;
        this.item = item;
        this.namespaceTbl = namespaceTbl;
    }
    return State;
}());
exports.State = State;
