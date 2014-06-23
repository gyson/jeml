

var parse = require("./template.js").parse;

var filename = __dirname + "/test.jeml";

var go = require("gocsp");

go.on('require', function (filename) {
    if (filename.slice(-5) === ".jeml") {
        // $require, $fork, $dirname, $filename
        go.yield(go.load(filename), function (err, file) {
            var $dirname = go.resolve(filename, "../");
            var $filename = filename;

            var $load    = function (path) { return go.load(go.resolve($dirname, path)); };
            var $require = function (path) { return go.require(go.resolve($dirname, path)); };
            var $export  = function (obj)  { go.export($filename, obj); };

            var body = parse(file);

            // only for absolute file path, not for http one
            if (go.isNode() && filename[0] === "/") {
                var Module = require("module");
                var $module = new Module(filename);                
                var script = new Function("$load", "$require", "$export", "__dirname", "__filename", "require", body);
                script($load, $require, $export, $dirname, $filename, $module.require.bind($module));
            } else {
                var script = new Function("$load", "$require", "$export", "__dirname", "__filename", body);
                script($load, $require, $export, $dirname, $filename);
            }
        });
    }
});

go(function* () {

	var temp = yield go.require(filename);

	console.log(temp({okk: "I am feeling ok.!!!"}));

});



