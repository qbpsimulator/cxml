"use strict";
// This file is part of cxml, copyright (c) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
var ContextBase_1 = require("./xml/ContextBase");
exports.ContextBase = ContextBase_1.ContextBase;
var NamespaceBase_1 = require("./xml/NamespaceBase");
exports.NamespaceBase = NamespaceBase_1.NamespaceBase;
var TypeSpec_1 = require("./xml/TypeSpec");
exports.TypeSpec = TypeSpec_1.TypeSpec;
var MemberSpec_1 = require("./xml/MemberSpec");
exports.MemberSpec = MemberSpec_1.MemberSpec;
var MemberRef_1 = require("./xml/MemberRef");
exports.MemberRef = MemberRef_1.MemberRef;
var Parser_1 = require("./parser/Parser");
exports.Parser = Parser_1.Parser;
var JS_1 = require("./importer/JS");
exports.init = JS_1.init;
exports.register = JS_1.register;
exports.defaultContext = JS_1.defaultContext;
