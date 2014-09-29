
var MAGIC_NUMBER = 301;

var hasEscapedChars = /&|<|>|"/;

function e1 (arg) {
    //if (arg == null) return "";
    //if (typeof arg !== 'string') return arg;

    //arg = arg || "";

    // when .length is small (eg. length < 300)
    // overhead to test if it has escaped characters is small
    if (arg.length < MAGIC_NUMBER && !hasEscapedChars.test(arg)) { return arg }
    //if (!hasEscapedChars.test(arg)) { return arg }


    return arg
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

function e2 (arg) {
    return arg
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
};

// Functions for escaping and unescaping strings to/from HTML interpolation.
var createEscaper = function(map) {

    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
    string = string == null ? '' : '' + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
};

function escaper (match) {
    return escapeMap[match];
};

var source = '(?:' + Object.keys(escapeMap).join('|') + ')';
var testRegexp = RegExp(source);
var replaceRegexp = RegExp(source, 'g');

function e3 (arg) {
    return testRegexp.test(arg) ? arg.replace(replaceRegexp, escaper) : arg
}

var all = [e1, e2, e3]

benchAll(createBench("abcddddddd", 100000), all, "small without escape")
benchAll(createBench("abcdd&dddd", 100000), all, 'small with escape')

benchAll(createBench(createString(100, false), 100000), all, "100 without escape")
benchAll(createBench(createString(100, true),  100000), all, "100 with escape")



benchAll(createBench(createString(150, false), 100000), all, "150 without escape")
benchAll(createBench(createString(150, true),  100000), all, "150 with escape")


benchAll(createBench(createString(200, false), 100000), all, "200 without escape")
benchAll(createBench(createString(200, true),  100000), all, "200 with escape")


benchAll(createBench(createString(250, false), 100000), all, "250 without escape")
benchAll(createBench(createString(250, true),  100000), all, "250 with escape")



benchAll(createBench(createString(300, false), 100000), all, "300 without escape")
benchAll(createBench(createString(300, true),  100000), all, "300 with escape")


benchAll(createBench(createString(400, false), 100000), all, "400 without escape")
benchAll(createBench(createString(400, true),  100000), all, "400 with escape")


benchAll(createBench(createString(500, false), 100000), all, "500 without escape")
benchAll(createBench(createString(500, true),  100000), all, "500 with escape")


benchAll(createBench(createString(800, false), 100000), all, "800 without escape")
benchAll(createBench(createString(800, true),  100000), all, "800 with escape")

function createString (size, hasEscapeChar) {
    var x = '';
    if (hasEscapeChar) {
        var size = size / 2
        for (var i = 0; i < size; i++) {
            x += 'a'
        }
        x = x + '&<>"' + x + '&<>'
    } else {
        for (var i = 0; i < size; i++) {
            x += 'a'
        }
    }
    return x
}


function benchAll(test, fns, name) {
    console.log("\n=====", name, "=====")
    test(fns[0])
    test(fns[1])
    fns.forEach(function (fn) {
        console.log(fn.name, test(fn))
    })
    test(fns[0])
}

function createBench (str, iteration) {

    return function (fn) {
        var start = Date.now()

        for (var i = 0; i < iteration; i++) {
            fn(str)
        }

        return Date.now() - start
    }

}
