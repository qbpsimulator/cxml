"use strict";
// This file is part of cxml, copyright (c) 2016 BusFaster Ltd.
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
var MemberRef_1 = require("./MemberRef");
var Rule_1 = require("../parser/Rule");
var Item_1 = require("./Item");
/** Parse name from schema in serialized JSON format.
  * If name used in XML is not a valid JavaScript identifier, the schema
  * definition will be in format <cleaned up name for JavaScript>:<XML name>. */
function parseName(name) {
    var splitPos = name.indexOf(':');
    var safeName;
    if (splitPos >= 0) {
        safeName = name.substr(0, splitPos);
        name = name.substr(splitPos + 1);
    }
    else
        safeName = name;
    return ({
        name: name,
        safeName: safeName
    });
}
exports.parseName = parseName;
/** Create a new data object inheriting default values from another. */
function inherit(parentObject) {
    function Proxy() { }
    Proxy.prototype = parentObject;
    return (new Proxy());
}
function defineSubstitute(substitute, proxy) {
    var ref = MemberRef_1.MemberRef.parseSpec([substitute, 0, substitute.safeName], substitute.namespace, proxy);
    return (ref);
}
/** Type specification defining attributes and children. */
var TypeSpec = (function (_super) {
    __extends(TypeSpec, _super);
    function TypeSpec(name, namespace, spec) {
        var _this = _super.call(this, TypeSpec, spec[1]) || this;
        _this.optionalList = [];
        _this.requiredList = [];
        if (name) {
            var parts = parseName(name);
            _this.name = parts.name;
            _this.safeName = parts.safeName;
        }
        _this.namespace = namespace;
        if (spec) {
            _this.flags = spec[0];
            _this.childSpecList = spec[2];
            _this.attributeSpecList = spec[3];
        }
        return _this;
    }
    TypeSpec.prototype.getProto = function () { return (this.proto); };
    TypeSpec.prototype.getType = function () { return (this.rule); };
    TypeSpec.prototype.init = function () {
        // This function hasn't been called for this type yet by setParent,
        // but something must by now have called it for the parent type.
        var dependency = this.dependency;
        var parent = Rule_1.Member;
        if (dependency && dependency != this)
            parent = dependency.proto;
        this.proto = (function (_super) {
            __extends(XmlType, _super);
            function XmlType() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return XmlType;
        }(parent));
        var instanceProto = this.proto.prototype;
        instanceProto._exists = true;
        instanceProto._namespace = this.namespace.name;
        this.placeHolder = new this.proto();
        this.placeHolder._exists = false;
        this.rule = new Rule_1.Rule(this.proto);
        this.proto.rule = this.rule;
        this.rule.namespace = this.namespace;
        if (dependency) {
            this.rule.childTbl = inherit(dependency.rule.childTbl);
            this.rule.attributeTbl = inherit(dependency.rule.attributeTbl);
        }
        else {
            this.rule.attributeTbl = {};
            this.rule.childTbl = {};
        }
        this.rule.isPrimitive = !!(this.flags & 1 /* primitive */);
        this.rule.isPlainPrimitive = !!(this.flags & 2 /* plainPrimitive */);
        this.rule.isList = !!(this.flags & 4 /* list */);
        if (this.rule.isPrimitive) {
            var primitiveType = this;
            var next;
            while ((next = primitiveType.dependency) && next != primitiveType)
                primitiveType = next;
            this.rule.primitiveType = primitiveType.safeName;
        }
        return (this.rule);
    };
    TypeSpec.prototype.defineMember = function (ref) {
        var typeSpec = ref.member.typeSpecList && ref.member.typeSpecList[0];
        var proxySpec = ref.member.proxySpec;
        if (proxySpec) {
            if (ref.max > 1) {
                typeSpec = proxySpec;
            }
            else {
                proxySpec = this;
                typeSpec = null;
            }
            TypeSpec.addSubstitutesToProxy(ref.member, proxySpec.proto.prototype);
        }
        if (typeSpec) {
            var memberType = typeSpec.placeHolder;
            var type = (this.proto.prototype);
            type[ref.safeName] = (ref.max > 1) ? [memberType] : memberType;
            if (ref.min < 1)
                this.optionalList.push(ref.safeName);
            else
                this.requiredList.push(ref.safeName);
        }
        return (ref);
    };
    TypeSpec.prototype.getSubstitutes = function () {
        return (this.substituteList);
    };
    TypeSpec.prototype.defineMembers = function () {
        var spec;
        for (var _i = 0, _a = this.childSpecList; _i < _a.length; _i++) {
            spec = _a[_i];
            var memberRef = MemberRef_1.MemberRef.parseSpec(spec, this.namespace);
            this.addChild(memberRef);
            this.defineMember(memberRef);
        }
        for (var _b = 0, _c = this.attributeSpecList; _b < _c.length; _b++) {
            spec = _c[_b];
            var attributeRef = MemberRef_1.MemberRef.parseSpec(spec, this.namespace);
            if (attributeRef.member.typeSpecList)
                this.rule.addAttribute(attributeRef);
            this.defineMember(attributeRef);
        }
    };
    TypeSpec.prototype.addSubstitutes = function (headRef, proxy) {
        headRef.member.containingTypeList.push({
            type: this,
            head: headRef,
            proxy: proxy
        });
        headRef.member.proxySpec.tryInit();
        for (var _i = 0, _a = headRef.member.proxySpec.getSubstitutes(); _i < _a.length; _i++) {
            var substitute = _a[_i];
            if (substitute == headRef.member) {
                this.rule.addChild(headRef);
            }
            else {
                var substituteRef = defineSubstitute(substitute, proxy);
                this.addChild(substituteRef, proxy);
            }
        }
    };
    TypeSpec.prototype.addChild = function (memberRef, proxy) {
        if (memberRef.member.proxySpec)
            this.addSubstitutes(memberRef, proxy || memberRef);
        else if (!memberRef.member.isAbstract)
            this.rule.addChild(memberRef);
    };
    TypeSpec.prototype.addSubstitute = function (head, substitute) {
        if (this.ready && head.containingTypeList.length) {
            // The element's proxy type has already been defined
            // so we need to patch other types containing the element.
            for (var _i = 0, _a = head.containingTypeList; _i < _a.length; _i++) {
                var spec = _a[_i];
                var ref = defineSubstitute(substitute, spec.proxy);
                spec.type.addChild(ref, spec.proxy);
                if (spec.head.max <= 1) {
                    TypeSpec.addSubstituteToProxy(substitute, spec.type.proto.prototype);
                }
            }
            // Add the substitution to proxy type of the group head,
            // and loop if the head further substitutes something else.
            while (head) {
                TypeSpec.addSubstituteToProxy(substitute, head.proxySpec.proto.prototype);
                head = head.dependency;
            }
        }
        this.substituteList.push(substitute);
    };
    TypeSpec.prototype.addMixin = function (spec) {
        this.mixinList.push(spec);
    };
    /** Remove placeholders from instance prototype. They allow dereferencing
      * contents of missing optional child elements without throwing errors.
      * @param strict Also remove placeholders for mandatory child elements. */
    TypeSpec.prototype.cleanPlaceholders = function (strict) {
        var type = (this.proto.prototype);
        var nameList = this.optionalList;
        if (strict)
            nameList = nameList.concat(this.requiredList);
        for (var _i = 0, nameList_1 = nameList; _i < nameList_1.length; _i++) {
            var name = nameList_1[_i];
            delete (type[name]);
        }
    };
    TypeSpec.addSubstituteToProxy = function (substitute, type, head) {
        if (substitute == head || !substitute.proxySpec) {
            if (!substitute.isAbstract)
                type[substitute.safeName] = substitute.typeSpecList[0].placeHolder;
        }
        else {
            TypeSpec.addSubstitutesToProxy(substitute, type);
        }
    };
    TypeSpec.addSubstitutesToProxy = function (member, type) {
        for (var _i = 0, _a = member.proxySpec.getSubstitutes(); _i < _a.length; _i++) {
            var substitute = _a[_i];
            TypeSpec.addSubstituteToProxy(substitute, type, member);
        }
    };
    return TypeSpec;
}(Item_1.Item));
exports.TypeSpec = TypeSpec;
