"use strict";
// This file is part of cxml, copyright (c) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
var MemberRef = (function () {
    function MemberRef(member, min, max) {
        this.member = member;
        this.min = min;
        this.max = max;
    }
    MemberRef.parseSpec = function (spec, namespace, proxy) {
        var flags = spec[1];
        var member;
        if (typeof (spec[0]) == 'number')
            member = namespace.memberByNum(spec[0]);
        else
            member = spec[0];
        var ref = new MemberRef(member, (flags & 1 /* optional */) ? 0 : 1, (flags & 2 /* array */) ? Infinity : 1);
        ref.safeName = spec[2] || member.safeName;
        if (member.isSubstituted)
            proxy = ref;
        if (proxy && ref.max > 1)
            ref.proxy = proxy;
        return (ref);
    };
    return MemberRef;
}());
exports.MemberRef = MemberRef;
