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
var Namespace_1 = require("./Namespace");
var TypeSpec_1 = require("./TypeSpec");
var MemberSpec_1 = require("./MemberSpec");
var Item_1 = require("../xml/Item");
var ContextBase_1 = require("./ContextBase");
/** XML parser context, holding definitions of all imported namespaces. */
var Context = (function (_super) {
    __extends(Context, _super);
    function Context() {
        var _this = _super.call(this, Namespace_1.Namespace) || this;
        /** List of pending namespaces (not yet registered or waiting for processing). */
        _this.pendingNamespaceList = [];
        /** Grows with pendingNamespaceList and shrinks when namespaces are registered.
          * When zero, all pending namespaces have been registered and can be processed. */
        _this.pendingNamespaceCount = 0;
        _this.pendingTypeList = [];
        _this.pendingMemberList = [];
        _this.typeList = [];
        return _this;
    }
    /** Mark a namespace as seen and add it to list of pending namespaces. */
    Context.prototype.markNamespace = function (exportObj) {
        this.pendingNamespaceList.push(exportObj);
        ++this.pendingNamespaceCount;
    };
    /** Parse types from schema in serialized JSON format. */
    Context.prototype.registerTypes = function (namespace, exportTypeNameList, rawTypeSpecList) {
        var exportTypeCount = exportTypeNameList.length;
        var typeCount = rawTypeSpecList.length;
        var typeName;
        for (var typeNum = 0; typeNum < typeCount; ++typeNum) {
            var rawSpec = rawTypeSpecList[typeNum];
            if (typeNum > 0 && typeNum <= exportTypeCount) {
                typeName = exportTypeNameList[typeNum - 1];
            }
            else
                typeName = null;
            var typeSpec = new TypeSpec_1.TypeSpec(typeName, namespace, rawSpec);
            namespace.addType(typeSpec);
            this.pendingTypeList.push(typeSpec);
            this.typeList.push(typeSpec);
        }
    };
    /** Parse members from schema in serialized JSON format. */
    Context.prototype.registerMembers = function (namespace, rawMemberSpecList) {
        for (var _i = 0, rawMemberSpecList_1 = rawMemberSpecList; _i < rawMemberSpecList_1.length; _i++) {
            var rawSpec = rawMemberSpecList_1[_i];
            var memberSpec = MemberSpec_1.MemberSpec.parseSpec(rawSpec, namespace);
            namespace.addMember(memberSpec);
            this.pendingMemberList.push(memberSpec);
        }
    };
    /** Process namespaces seen so far. */
    Context.prototype.process = function () {
        // Start only when process has been called for all namespaces.
        if (--this.pendingNamespaceCount > 0)
            return;
        // Link types to their parents.
        for (var _i = 0, _a = this.pendingNamespaceList; _i < _a.length; _i++) {
            var exportObject = _a[_i];
            var namespace = exportObject._cxml[0];
            namespace.link();
        }
        // Create classes for all types.
        // This is effectively Kahn's algorithm for topological sort
        // (the rest is in the TypeSpec class).
        Item_1.Item.initAll(this.pendingTypeList);
        Item_1.Item.initAll(this.pendingMemberList);
        for (var _b = 0, _c = this.pendingTypeList; _b < _c.length; _b++) {
            var typeSpec = _c[_b];
            typeSpec.defineMembers();
        }
        this.pendingTypeList = [];
        this.pendingMemberList = [];
        for (var _d = 0, _e = this.pendingNamespaceList; _d < _e.length; _d++) {
            var exportObject = _e[_d];
            var namespace = exportObject._cxml[0];
            namespace.exportTypes(exportObject);
            namespace.exportDocument(exportObject);
        }
        this.pendingNamespaceList = [];
    };
    /** Remove temporary structures needed to define new handlers. */
    Context.prototype.cleanPlaceholders = function (strict) {
        for (var _i = 0, _a = this.namespaceList; _i < _a.length; _i++) {
            var namespace = _a[_i];
            namespace.importSpecList = null;
            namespace.exportTypeNameList = null;
            namespace.typeSpecList = null;
            namespace.memberSpecList = null;
            namespace.exportTypeTbl = null;
            namespace.exportMemberTbl = null;
        }
        for (var _b = 0, _c = this.typeList; _b < _c.length; _b++) {
            var typeSpec = _c[_b];
            typeSpec.cleanPlaceholders(strict);
        }
        this.typeList = null;
    };
    return Context;
}(ContextBase_1.ContextBase));
exports.Context = Context;
