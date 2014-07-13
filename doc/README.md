# Syntax for *.jeml


## different proposal

*.jeml

    default {
        @name(v1, v2 v3)
    }

    mixin name () {
        p: 'hello'
    }

    =>

    exports.default = function () {
        name.call(this, v1, v2, v3)
    }

    // jeml-render
    // jeml-parse


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


## import

    import layout './layout'

    import layout from './layout'

    import { layout } './layout'

    import { layout } from './layout'

    import { layout as lay } './layout'

    import { layout as abc, default as okk } from './layout'

## default

    default {

    }

    default name {

    }

## export

    export name {

    }

## mixin

    mixin name {

    }

    mixin name () {

    }

    // use mixin

    @name(a, b, c)

    // mixin with js expression as arguments

    @name(`a, b-10, something.fn(c)`)
