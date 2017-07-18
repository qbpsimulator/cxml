"use strict";
// This file is part of cxml, copyright (c) 2016-2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var sax = require("sax");
var State_1 = require("./State");
var JS_1 = require("../importer/JS");
var converterTbl = {
    Date: (function (item) {
        var dateParts = item.match(/([0-9]+)-([0-9]+)-([0-9]+)(?:T([0-9]+):([0-9]+):([0-9]+)(\.[0-9]+)?)?(?:Z|([+-][0-9]+):([0-9]+))?/);
        if (!dateParts)
            return (null);
        var offsetMinutes = +(dateParts[9] || '0');
        var offset = +(dateParts[8] || '0') * 60;
        if (offset < 0)
            offsetMinutes = -offsetMinutes;
        offset += offsetMinutes;
        var date = new Date(+dateParts[1], +dateParts[2] - 1, +dateParts[3], +(dateParts[4] || '0'), +(dateParts[5] || '0'), +(dateParts[6] || '0'), +(dateParts[7] || '0') * 1000);
        date.setTime(date.getTime() - (offset + date.getTimezoneOffset()) * 60000);
        date.cxmlTimezoneOffset = offset;
        return (date);
    }),
    boolean: (function (item) { return item == 'true'; }),
    string: (function (item) { return item; }),
    number: (function (item) { return +item; })
};
function convertPrimitive(text, type) {
    var converter = converterTbl[type.primitiveType];
    if (converter) {
        if (type.isList) {
            return (text.trim().split(/\s+/).map(converter));
        }
        else {
            return (converter(text.trim()));
        }
    }
    return (null);
}
var Parser = (function () {
    function Parser() {
    }
    Parser.prototype.attach = function (handler) {
        var proto = handler.prototype;
        var realHandler = handler.rule.handler;
        var realProto = realHandler.prototype;
        for (var _i = 0, _a = Object.keys(proto); _i < _a.length; _i++) {
            var key = _a[_i];
            realProto[key] = proto[key];
        }
        realHandler._custom = true;
    };
    Parser.prototype.parse = function (stream, output, context) {
        var _this = this;
        return (new Promise(function (resolve, reject) {
            return _this._parse(stream, output, context || JS_1.defaultContext, resolve, reject);
        }));
    };
    Parser.prototype._parse = function (stream, output, context, resolve, reject) {
        var xml = sax.createStream(true, { position: true });
        var rule = output.constructor.rule;
        var xmlSpace = context.registerNamespace('http://www.w3.org/XML/1998/namespace');
        var namespaceTbl = {
            '': [rule.namespace, rule.namespace.getPrefix()],
            'xml': [xmlSpace, xmlSpace.getPrefix()]
        };
        var state = new State_1.State(null, null, rule, new rule.handler(), namespaceTbl);
        var rootState = state;
        var parentItem;
        /** Add a new xmlns prefix recognized inside current tag and its children. */
        function addNamespace(short, namespace) {
            if (namespaceTbl[short] && namespaceTbl[short][0] == namespace)
                return;
            if (namespaceTbl == state.namespaceTbl) {
                // Copy parent namespace table on first write.
                namespaceTbl = {};
                for (var _i = 0, _a = Object.keys(state.namespaceTbl); _i < _a.length; _i++) {
                    var key = _a[_i];
                    namespaceTbl[key] = state.namespaceTbl[key];
                }
            }
            namespaceTbl[short] = [namespace, namespace.getPrefix()];
        }
        xml.on('opentag', function (node) {
            var attrTbl = node.attributes;
            var attr;
            var nodePrefix = '';
            var name = node.name;
            var splitter = name.indexOf(':');
            var item = null;
            namespaceTbl = state.namespaceTbl;
            // Read xmlns namespace prefix definitions before parsing node name.
            for (var _i = 0, _a = Object.keys(attrTbl); _i < _a.length; _i++) {
                var key = _a[_i];
                if (key.substr(0, 5) == 'xmlns') {
                    var nsParts = key.match(/^xmlns(:(.+))?$/);
                    if (nsParts) {
                        addNamespace(nsParts[2] || '', context.registerNamespace(attrTbl[key]));
                    }
                }
            }
            // Parse node name and possible namespace prefix.
            if (splitter >= 0) {
                nodePrefix = name.substr(0, splitter);
                name = name.substr(splitter + 1);
            }
            // Add internal surrogate key namespace prefix to node name.
            var nodeNamespace = namespaceTbl[nodePrefix];
            name = nodeNamespace[1] + name;
            var child;
            var rule;
            if (state.rule) {
                child = state.rule.childTbl[name];
                if (child) {
                    if (child.proxy) {
                        rule = child.proxy.member.rule;
                        state = new State_1.State(state, child.proxy, rule, new rule.handler(), namespaceTbl);
                    }
                    rule = child.member.rule;
                }
            }
            if (rule && !rule.isPlainPrimitive) {
                item = new rule.handler();
                // Parse all attributes.
                for (var _b = 0, _c = Object.keys(attrTbl); _b < _c.length; _b++) {
                    var key = _c[_b];
                    splitter = key.indexOf(':');
                    if (splitter >= 0) {
                        var attrPrefix = key.substr(0, splitter);
                        if (attrPrefix == 'xmlns')
                            continue;
                        var attrNamespace = namespaceTbl[attrPrefix];
                        if (attrNamespace) {
                            attr = attrNamespace[1] + key.substr(splitter + 1);
                        }
                        else {
                            console.log('Namespace not found for ' + key);
                            continue;
                        }
                    }
                    else {
                        attr = nodeNamespace[1] + key;
                    }
                    var ref = rule.attributeTbl[attr];
                    if (ref && ref.member.rule.isPlainPrimitive) {
                        item[ref.safeName] = convertPrimitive(attrTbl[key], ref.member.rule);
                    }
                }
                if (state.parent) {
                    Object.defineProperty(item, '_parent', {
                        enumerable: false,
                        value: state.parent.item
                    });
                }
                Object.defineProperty(item, '_name', {
                    enumerable: false,
                    value: node.name
                });
                if (item._before)
                    item._before();
            }
            state = new State_1.State(state, child, rule, item, namespaceTbl);
        });
        xml.on('text', function (text) {
            if (state.rule && state.rule.isPrimitive) {
                if (!state.textList)
                    state.textList = [];
                state.textList.push(text);
            }
        });
        xml.on('closetag', function (name) {
            var member = state.memberRef;
            var obj = state.item;
            var item = obj;
            var text;
            if (state.rule && state.rule.isPrimitive)
                text = (state.textList || []).join('').trim();
            if (text) {
                var content = convertPrimitive(text, state.rule);
                if (state.rule.isPlainPrimitive)
                    item = content;
                else
                    obj.content = content;
            }
            if (obj && obj._after)
                obj._after();
            var isValidItem = item || (typeof (item) === 'number') && !!text;
            state = state.parent;
            if (member && member.proxy) {
                if (isValidItem)
                    state.item[member.safeName] = item;
                item = state.item;
                state = state.parent;
                member = member.proxy;
            }
            if (isValidItem) {
                var parent = state.item;
                if (parent) {
                    if (member.max > 1) {
                        if (!parent.hasOwnProperty(member.safeName))
                            parent[member.safeName] = [];
                        parent[member.safeName].push(item);
                    }
                    else
                        parent[member.safeName] = item;
                }
            }
        });
        xml.on('end', function () {
            resolve(rootState.item);
        });
        xml.on('error', function (err) {
            console.error(err);
        });
        if (typeof (stream) == 'string') {
            xml.write(stream);
            xml.end();
        }
        else
            stream.pipe(xml);
    };
    return Parser;
}());
exports.Parser = Parser;
