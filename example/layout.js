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
exports['default'] = __0;

function __0(title, body) {
    var __l = [],
        __p = [].push.bind(__l);
    __p('<html');
    __p('>');
    __p('<head');
    __p('>');
    __p('<title');
    __p('>');
    __p(title);
    __p('</title>');
    __p('<script');
    __p(' src="some_address..."');
    __p('>');
    __p('</script>');
    __p('</head>');
    __p('<body');
    __p('>');
    __p(body);
    __p('</body>');
    __p('</html>');
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