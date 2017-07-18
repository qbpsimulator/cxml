"use strict";
// This file is part of cxml, copyright (c) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
/** Base class inherited by all schema type classes, not defining custom hooks. */
var Member = (function () {
    function Member() {
    }
    return Member;
}());
exports.Member = Member;
/** Parser rule, defines a handler class, valid attributes and children
  * for an XSD tag. */
var Rule = (function () {
    function Rule(handler) {
        /** Table of allowed attributes. */
        this.attributeTbl = {};
        this.handler = handler;
    }
    Rule.prototype.addAttribute = function (ref) {
        this.attributeTbl[ref.member.namespace.getPrefix() + ref.member.name] = ref;
    };
    Rule.prototype.addChild = function (ref) {
        this.childTbl[ref.member.namespace.getPrefix() + ref.member.name] = ref;
    };
    return Rule;
}());
exports.Rule = Rule;
