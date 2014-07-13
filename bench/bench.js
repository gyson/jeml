
var all = {
    ejs: require('./ejs'),
    jeml: require('./jeml'),
    //jade: require('./jade')
    //handlebars: require('./handlebars'),
    dot: require('./dot')
}

//var a = Object.keys(all).join(' ');

// bench `small`

'ejs jeml dot'
.split(' ').forEach(function (name) {

    // check correctness

    console.log('========', name);

    var start = Date.now();

    for (var i = 0; i < 1000000; i++) {
        all[name].simple();
    }

    console.log('takes ', Date.now() - start, '\tmilisecond\n');
});

// Object.keys(all).forEach(function (name) {
//
//     // check correctness
//
//     console.log('========', name);
//
//     var start = Date.now();
//
//     for (var i = 0; i < 1000000; i++) {
//         all[name].simple();
//     }
//
//     console.log('takes ', Date.now() - start, '\tmilisecond\n');
// });



// exec sample

// exec
