"use strict";
// This file is part of cxml, copyright (c) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
var NamespaceBase = (function () {
    function NamespaceBase(name, id, context) {
        this.name = name;
        this.id = id;
        this.context = context;
    }
    NamespaceBase.prototype.addType = function (spec) { };
    NamespaceBase.prototype.typeByNum = function (spec) { };
    NamespaceBase.prototype.getPrefix = function () { return (''); };
    NamespaceBase.prototype.initFrom = function (other) {
        this.schemaUrl = other.schemaUrl;
        this.short = other.short;
    };
    NamespaceBase.sanitize = function (name) {
        return (name && name.replace(/\/+$/, ''));
    };
    return NamespaceBase;
}());
exports.NamespaceBase = NamespaceBase;
