
# Take advantage with ES-6 generator ?

### usage


    with 'use strict'
    with 'generator'

    import layout './layout'

    default {
        // use co.js
        `yield fs.readFileWithPromise()`
        for x in y {
            @abc(name, efg, okk)
        }
    }

### proposal

    // with ES6 generator

    exports.default = function* () {
        this()
        yield* name.call(this, abc, efg)

        // or with co
        yield name.call(this, abc, efg)
    }

    function* name () {
        this(...)
        yield something

        yield* this.each([1, 2, 3], function* () {
            yield abc
        }, this);
    }


### it's async

therefore, need to use promise / stream api

    // promise
    jeml.render(templateFn, arg).then(function (data) {

    }, function (err) { ... })

    yield jeml.render(...)

    jeml.stream(...).pipe(process.stdout)

### conclusion

bad because it makes rendering async ?
