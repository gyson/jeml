var __each = function(obj, iterator) {
    var i, length;
    if (obj == null) return obj;
    if (obj.length === +obj.length) {
        for (i = 0, length = obj.length; i < length; i++) {
            iterator(obj[i], i, obj);
        }
    } else {
        var keys = Object.keys(obj);
        for (i = 0, length = keys.length; i < length; i++) {
            iterator(obj[keys[i]], keys[i], obj);
        }
    }
    return obj;
};
exports.default = name;

function name(okk, yes) {
    var __l = [],
        __p = [].push.bind(__l);
    __p('<html');
    __p('>');
    __p('<head');
    __p('>');
    __p('<title');
    __p('>');
    __p('Whatever');
    __p('</title>');
    __p('</head>');
    __p('<body');
    __p('>');
    __each([0, 1, 2, 3], function(val, name) {
        __p(some_mixin());
    });
    __p('</body>');
    __p('</html>');
    return __l.join('');
}

function some_mixin(test) {
    var __l = [],
        __p = [].push.bind(__l);
    __p('<p');
    __p('>');
    __p('okk');
    __p('</p>');
    return __l.join('');
}
exports.name2 = name2;

function name2(a1, a2) {
    var __l = [],
        __p = [].push.bind(__l);
    return __l.join('');
}
module.exports = (function() {
    if (exports.default) {
        var e = exports.default;
        __each(exports, function(value, name) {
            e[name] = value;
        });
        return e;
    } else {
        return exports;
    }
}());