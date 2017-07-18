"use strict";
// This file is part of cxml, copyright (c) 2015-2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var TypeSpec_1 = require("./TypeSpec");
var MemberRef_1 = require("./MemberRef");
var Item_1 = require("./Item");
/** Represents a child element or attribute. */
var MemberSpec = (function (_super) {
    __extends(MemberSpec, _super);
    function MemberSpec(name, dependencyNum) {
        var _this = _super.call(this, MemberSpec, dependencyNum) || this;
        _this.name = name;
        return _this;
    }
    MemberSpec.parseSpec = function (spec, namespace) {
        var parts = TypeSpec_1.parseName(spec[0]);
        var member = new MemberSpec(parts.name, spec[3]);
        member.safeName = parts.safeName;
        member.namespace = namespace;
        var typeNumList = spec[1];
        var flags = spec[2];
        member.isAbstract = !!(flags & 1 /* abstract */);
        member.isSubstituted = member.isAbstract || !!(flags & 2 /* substituted */);
        if (member.isSubstituted)
            member.containingTypeList = [];
        if (typeNumList.length == 1) {
            member.typeNum = typeNumList[0];
        }
        else {
            // TODO: What now? Make sure this is not reached.
            // Different types shouldn't be joined with | in .d.ts, instead
            // they should be converted to { TypeA: TypeA, TypeB: TypeB... }
            console.error('Member with multiple types: ' + parts.name);
        }
        return (member);
    };
    MemberSpec.prototype.init = function () {
        // Look up member type if available.
        // Sometimes abstract elements have no type.
        if (this.typeNum) {
            var typeSpec = this.namespace.typeByNum(this.typeNum);
            this.typeSpecList = [typeSpec];
            this.rule = typeSpec.getType();
            if (!this.rule)
                this.setDependency(typeSpec);
        }
        if (this.isSubstituted) {
            this.proxySpec = new TypeSpec_1.TypeSpec('', this.namespace, [0, 0, [], []]);
            this.proxySpec.substituteList = [];
            if (!this.isAbstract)
                this.proxySpec.addSubstitute(this, this);
        }
        if (this.dependency && this.dependency instanceof MemberSpec) {
            // Parent is actually the substitution group base element.
            this.dependency.proxySpec.addSubstitute(this.dependency, this);
        }
    };
    MemberSpec.prototype.getRef = function () {
        return (new MemberRef_1.MemberRef(this, 0, 1));
    };
    MemberSpec.prototype.getProxy = function (TypeSpec) {
        var proxy = this.proxySpec;
        if (!proxy) {
            proxy = new TypeSpec();
            proxy.isProxy = true;
            proxy.containingRef = this.getRef();
            this.proxySpec = proxy;
            this.namespace.addType(proxy);
            if (!this.isAbstract) {
                proxy.addChildSpec(this);
            }
        }
        return (proxy);
    };
    return MemberSpec;
}(Item_1.Item));
exports.MemberSpec = MemberSpec;
