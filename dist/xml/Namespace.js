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
var NamespaceBase_1 = require("./NamespaceBase");
var Namespace = (function (_super) {
    __extends(Namespace, _super);
    function Namespace() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.importNamespaceList = [];
        /** All types used in the document. */
        _this.typeSpecList = [];
        /** All members used in the document. */
        _this.memberSpecList = [];
        _this.exportTypeTbl = {};
        _this.exportMemberTbl = {};
        return _this;
    }
    Namespace.prototype.init = function (importSpecList) {
        this.importSpecList = importSpecList;
        // Separately defined document type is number 0.
        var importTypeOffset = 1;
        // Member number 0 is skipped.
        var importMemberOffset = 1;
        for (var _i = 0, importSpecList_1 = importSpecList; _i < importSpecList_1.length; _i++) {
            var importSpec = importSpecList_1[_i];
            importTypeOffset += importSpec[1].length;
            importMemberOffset += importSpec[2].length;
        }
        this.typeSpecList.length = importTypeOffset;
        this.memberSpecList.length = importMemberOffset;
        return (this);
    };
    Namespace.prototype.addType = function (spec) {
        if (this.doc)
            this.typeSpecList.push(spec);
        else {
            // First type added after imports is number 0, the document type.
            this.doc = spec;
        }
        if (spec.safeName)
            this.exportTypeTbl[spec.safeName] = spec;
        if (!spec.namespace)
            spec.namespace = this;
    };
    Namespace.prototype.addMember = function (spec) {
        this.memberSpecList.push(spec);
        if (spec.name)
            this.exportMemberTbl[spec.name] = spec;
        if (!spec.namespace)
            spec.namespace = this;
    };
    Namespace.prototype.typeByNum = function (num) {
        return (this.typeSpecList[num]);
    };
    Namespace.prototype.memberByNum = function (num) {
        return (this.memberSpecList[num]);
    };
    Namespace.prototype.link = function () {
        // Skip the document type.
        var typeNum = 1;
        var memberNum = 1;
        for (var _i = 0, _a = this.importSpecList; _i < _a.length; _i++) {
            var importSpec = _a[_i];
            var other = importSpec[0]._cxml[0];
            this.importNamespaceList.push(other);
            for (var _b = 0, _c = importSpec[1]; _b < _c.length; _b++) {
                var typeName = _c[_b];
                this.typeSpecList[typeNum++] = other.exportTypeTbl[typeName];
            }
            for (var _d = 0, _e = importSpec[2]; _d < _e.length; _d++) {
                var memberName = _e[_d];
                this.memberSpecList[memberNum++] = other.exportMemberTbl[memberName];
            }
        }
        this.exportOffset = typeNum;
        var typeSpecList = this.typeSpecList;
        var typeCount = typeSpecList.length;
        while (typeNum < typeCount) {
            typeSpecList[typeNum++].resolveDependency(typeSpecList);
        }
        var memberSpecList = this.memberSpecList;
        var memberCount = memberSpecList.length;
        while (memberNum < memberCount) {
            memberSpecList[memberNum++].resolveDependency(memberSpecList);
        }
    };
    Namespace.prototype.exportTypes = function (exports) {
        var typeSpecList = this.typeSpecList;
        var typeCount = typeSpecList.length;
        for (var typeNum = this.exportOffset; typeNum < typeCount; ++typeNum) {
            var typeSpec = typeSpecList[typeNum];
            exports[typeSpec.safeName] = typeSpec.getProto();
        }
    };
    Namespace.prototype.exportDocument = function (exports) {
        exports['document'] = this.doc.getProto().prototype;
    };
    /** Get an internally used arbitrary prefix for fully qualified names
      * in this namespace. */
    Namespace.prototype.getPrefix = function () { return (this.id + ':'); };
    return Namespace;
}(NamespaceBase_1.NamespaceBase));
exports.Namespace = Namespace;
