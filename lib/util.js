
// based on _.each
exports.each = function (obj, iterator, context) {
    if (obj == null) return obj;
    var i, len = obj.length;
    if (len === +len) {
        for (i = 0; i < len; i++) {
            iterator.call(context, obj[i], i, obj);
        }
    } else {
        var keys = Object.keys(obj);
        for (i = 0, len = keys.length; i < len; i++) {
            iterator.call(context, obj[keys[i]], keys[i], obj);
        }
    }
    return obj;
};

var hasEscapedChars = /&|<|>|"/;

exports.escape = function (arg) {

    if (arg == null) return '';

    if (typeof arg !== 'string') return arg;

    // when .length is small (eg. length < 300)
    // overhead to test if it has escaped characters is small
    if (arg.length < 300 && !hasEscapedChars.test(arg)) return arg;

    return arg
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
}
