# use S-expression: SEML

    % "use strict";

    (import
        fs 'fs'
        layout './layout'
        {abc as k, efg as f} './hello')

    (default name [abc, efg, okk]
        (doctype html)
        (html
            (head
                (title &'my title is #{title}')
                (script '
                    function mutlipleLine () {

                    }
                    var name = ...
                ')

                (script { fs.readFile(__dirname + '/abc.js') })))

            % var abc = ['hello', 'yes'].join(' ');

            (body [input="hello" world='10']
                (h1 "I am feeling good")

                % js statement...
                % js statement...

                % if (x > 10) {

                    (p 'okkk')
                    (import
                        fs 'fs'
                        layout './layout')

                % }

                // exports.name = name
                // function name () {...}
                (export name ...)

                (p 'name os something' { expression } 'good to play with.')

                (if )

                (+ name [a, b, c, d])

                (case [abc.length]
                    when [x, exp, exp]
                        (p 'length')
                    when [x]
                        (p 'okkk')
                    else
                        (p 'length'))

                (cond
                    when [x > 10] (...)
                    when [x < 10] (...)
                    else          (...))

                (let [a * 10 as k, argument.length as len]
                    (p 'name #{len}'))

                (if [express]
                    then (p exp)
                    else (e xpp))

                (comment "hello, I am just comment")

                // `expression` => "#{expression}" {name}={okk}
                (input [id='name' okk='that' title="#{name.title}"] /)

                (each [value, index, obj in exp]
                    (+ name [1, 2, 3]))

                (if [expression]
                    then
                        (p "expression")
                    else
                        (p "okkkkkkkkk"))


                // use var name = ...
                (mixin name []
                    (each [value, index, obj in abc]
                        (+ name [b, c, d]))

                    (each [v, i, o in abc]
                        (input [name='hello', abc='problem', efg='yes'])
                        (input [] /)
                        (form [name='abc' efg='sss' iii='sss']
                            (input ...)
                            (submit abc))))))
