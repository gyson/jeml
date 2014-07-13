exports['default'] = name;

function name(name) {
    this('<html');
    this('>');
    this('<head');
    this('>');
    this('<title');
    this('>');
    this('Hello, ');
    this(name);
    this('</title>');
    this('</head>');
    this('<body');
    this('>');
    this.each([0, 1, 2, 3], function(val, name) {
        this(some_mixin.call(this));
    }, this);
    this('</body>');
    this('</html>');
}

function some_mixin(test) {
    this('<p');
    this('>');
    this('okk');
    this('</p>');
}
exports['name2'] = name2;

function name2(a1, a2) {
    this('<okk');
    this('>');
    this('dd');
    this('</okk>');
}
module.exports = (function() {
    var e = exports['default'] = exports['default'] || (function() {});
    for (var name in exports) {
        e[name] = exports[name];
    }
    return e;
}());