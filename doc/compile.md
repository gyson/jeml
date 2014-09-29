
# compile time evaluation ?

    #define @x [1, 2, 3]

    #each @n in @x {
        p: @n
    #}

    same as (but evaluated during compile time):

    p: '1'
    p: '2'
    p: '3'

    // during compile time
    #define @abc [ 1, 2, 3, 4 ]

    each @abc in [1, 2, 3] {
        p: @abc
    }

    #case {
    #when @x > 10:

    #when @y > 20:

    #else:

    #}

    # var x = [1, 2, 3, 4, 5]
    # x.forEach(function (e) {
        p(type=#[e])
    # })

    # if x > 10 {

    # }
