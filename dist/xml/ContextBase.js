"use strict";
// This file is part of cxml, copyright (c) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
var NamespaceBase_1 = require("./NamespaceBase");
/** XML parser context, holding definitions of all imported namespaces. */
var ContextBase = (function () {
    function ContextBase(NamespaceType) {
        /** Next available numeric surrogate key for new namespaces. */
        this.namespaceKeyNext = 0;
        /** List of namespaces indexed by a numeric surrogate key. */
        this.namespaceList = [];
        /** Table of namespaces by name in URI format (URL or URN).  */
        this.namespaceNameTbl = {};
        this.NamespaceType = NamespaceType;
    }
    /** Look up namespace by name. */
    ContextBase.prototype.namespaceByName = function (name) { return (this.namespaceNameTbl[name]); };
    /** Look up namespace by internal numeric surrogate key. */
    ContextBase.prototype.namespaceById = function (id) { return (this.namespaceList[id]); };
    /** Create or look up a namespace by name in URI (URL or URN) format. */
    ContextBase.prototype.registerNamespace = function (name) {
        name = NamespaceBase_1.NamespaceBase.sanitize(name);
        var namespace = this.namespaceByName(name);
        if (!namespace) {
            // Create a new namespace.
            var id = this.namespaceKeyNext++;
            namespace = new this.NamespaceType(name, id, this);
            this.namespaceNameTbl[name] = namespace;
            this.namespaceList[id] = namespace;
        }
        return (namespace);
    };
    /** Copy a namespace from another context. */
    ContextBase.prototype.copyNamespace = function (other) {
        var namespace = this.namespaceList[other.id];
        if (namespace) {
            if (namespace.name != other.name)
                throw (new Error('Duplicate namespace ID'));
            return (namespace);
        }
        if (this.namespaceByName(other.name))
            throw (new Error('Duplicate namespace name'));
        namespace = new this.NamespaceType(other.name, other.id, this);
        namespace.initFrom(other);
        this.namespaceNameTbl[other.name] = namespace;
        this.namespaceList[other.id] = namespace;
        if (this.namespaceKeyNext <= other.id)
            this.namespaceKeyNext = other.id + 1;
        return (namespace);
    };
    return ContextBase;
}());
exports.ContextBase = ContextBase;
