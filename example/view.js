var __each = function (obj, iterator) {
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
var layout = require("./layout");
exports['default'] = __1;

function __1() {
    var __l = [],
        __p = [].push.bind(__l);
    var title = "I am title";
    __p(layout(title, body()));
    return __l.join('');
}
function body() {
    var __l = [],
        __p = [].push.bind(__l);
    __p('<p');
    __p('>');
    __p('I am body');
    __p('</p>');
    var users = {
        "foo": "I am foo",
        "bar": "I am bar"
    }
    __each(users, function (introduction, name) {
        __p('<p');
        __p('>');
        __p('name: ');
        __p(name);
        __p('</p>');
        __p('<p');
        __p('>');
        __p('introduce: ');
        __p(introduction);
        __p('</p>');
    });
    return __l.join('');
}
exports['print_name'] = print_name;

function print_name(name) {
    var __l = [],
        __p = [].push.bind(__l);
    __p('<p');
    __p('>');
    __p('my name is ');
    __p(name);
    __p('</p>');
    return __l.join('');
}
module.exports = (function () {
    if (exports['default']) {
        var e = exports['default'];
        __each(exports, function (value, name) {
            e[name] = value;
        });
        return e;
    } else {
        return exports;
    }
}());