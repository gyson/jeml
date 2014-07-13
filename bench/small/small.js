exports['default'] = __0;

function __0(title, text) {
    this.push('<html><head><title>');
    this.push(title);
    this.push('</title></head><body><p>');
    this.push(text);
    this.push('</p></body></html>');
}
module.exports = exports['default'] = exports['default'] || (function() {});
Object.keys(exports).forEach(function(name) {
    module.exports[name] = exports[name];
});