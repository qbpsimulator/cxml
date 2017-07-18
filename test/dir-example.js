"use strict";
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
var fs = require("fs");
var path = require("path");
var cxml = require("..");
var example = require("./xmlns/dir-example");
var parser = new cxml.Parser();
parser.attach((function (_super) {
    __extends(DirHandler, _super);
    function DirHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** Fires when the opening <dir> and attributes have been parsed. */
    DirHandler.prototype._before = function () {
        console.log('\nBefore ' + this.name + ': ' + JSON.stringify(this));
    };
    /** Fires when the closing </dir> and children have been parsed. */
    DirHandler.prototype._after = function () {
        console.log('After  ' + this.name + ': ' + JSON.stringify(this));
    };
    return DirHandler;
}((example.document.dir.constructor))));
var result = parser.parse('<dir name="empty"></dir>', example.document);
result.then(function (doc) {
    console.log('\n=== empty ===\n');
    console.log(JSON.stringify(doc)); // {"dir":{"name":"empty"}}
    var dir = doc.dir;
    console.log(dir instanceof example.document.dir.constructor); // true
    console.log(dir instanceof example.document.file.constructor); // false
    console.log(dir instanceof example.DirType); // true
    console.log(dir instanceof example.FileType); // false
    console.log(dir._exists); // true
    console.log(dir.file[0]._exists); // false (not an error!)
});
result = parser.parse(fs.createReadStream(path.resolve(__dirname, 'xml/dir-example.xml')), example.document);
result.then(function (doc) {
    console.log('\n=== 123 ===\n');
    console.log(JSON.stringify(doc, null, 2));
});
