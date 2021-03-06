"use strict";
// This file is part of cxml, copyright (c) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
var Context_1 = require("../xml/Context");
/** Context for namespaces defined by calling register(). */
exports.defaultContext = new Context_1.Context();
/** Mark a namespace as seen. */
function mark(exportObj, namespace) {
    if (!exportObj._cxml) {
        exportObj._cxml = [null];
        exports.defaultContext.markNamespace(exportObj);
    }
    if (namespace)
        exportObj._cxml[0] = namespace;
}
/** Register a namespace.
  * This is called from JavaScript autogenerated by the cxsd compiler. */
function register(name, exportObject, importSpecList, exportTypeNameList, rawTypeSpecList, rawMemberSpecList) {
    var namespace = exports.defaultContext.registerNamespace(name).init(importSpecList);
    exports.defaultContext.registerTypes(namespace, exportTypeNameList, rawTypeSpecList);
    exports.defaultContext.registerMembers(namespace, rawMemberSpecList);
    mark(exportObject, namespace);
    for (var _i = 0, importSpecList_1 = importSpecList; _i < importSpecList_1.length; _i++) {
        var spec = importSpecList_1[_i];
        mark(spec[0]);
    }
    exports.defaultContext.process();
}
exports.register = register;
/** Remove temporary structures needed to define new handlers and initialize the parser. */
function init(strict) {
    exports.defaultContext.cleanPlaceholders(strict);
}
exports.init = init;
