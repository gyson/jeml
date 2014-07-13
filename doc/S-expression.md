# use S-expression

    (:with 'use strict')

    (:import
        fs 'fs'
        layout './layout')

    (:default name [abc efg okk]
        (:doctype 5)
        (html
            (head (title &'my title is `title`'))
            (body
                (h1 "I am feeling good")

                % var name = 10
                % var okk = 20
                % some expression

                + name(abcd, efg)
                # @name @okkk @yes @pig.love @name["abcd"].naokk

                (:def name []
                    (:for [index value in abc]
                        + name(a, b, c, d)
                        + student(a, b, c, d)

                    (:for [value in abc]
                        (input [name='hello' abc='problem' efg='yes'])
                        (input []/)
                        (form [name='abc' efg='sss' iii='sss']
                            (input ...)
                            (submit abc)))

                    (:switch abc
                        [1 2 3] abc ...
                        [2] efg xx
                        []  "" )))))

    (script '''
        function abc () {
            name()
        }
    ''')
