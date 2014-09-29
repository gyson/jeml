

%lex
%%

\s+                        /* skip whitespace        */
(\/\/).*                   /* skip comment           */
(\/\*)(.|\n|\r)*?(\*\/)    /* skip multiline comment */

"%".*                      return 'STATEMENT'

"'"("\\".|[^'])*"'"        return 'SINGLE_QUOTE'
"\""("\\".|[^"])*"\""      return 'DOUBLE_QUOTE'

"import"                  return 'IMPORT'
"export"                  return 'EXPORT'
"default"                 return 'DEFAULT'
"each"                    return 'FOR'
"if"                      return 'IF'
"case"                    return 'CASE'
"cond"                    return 'COND'
"when"                    return 'WHEN'
"else"                    return 'ELSE'
"mixin"                   return 'MIXIN'
'comment'                 return 'COMMENT'

"as"                       return 'AS'
"in"                       return 'IN'

[a-zA-Z_$][a-zA-Z_$0-9]*   return 'NAME'

"+"                        return '+'
"-"                        return '-'
"*"                        return '*'
"/"                        return '/'
"%"                        return '%'
"!"                        return '!'

"."                        return '.'
"||"                       return '||'
"|"                        return '|'
"&&"                       return '&&'
"&"                        return '&'

","                        return ','
":"                        return ':'

"("                        return '('
")"                        return ')'
"["                        return '['
"]"                        return ']'
"{"                        return '{'
"}"                        return '}'


<<EOF>>                    return 'EOF'

/lex

/* ... */

%start Template

%%


Template
    : JemlNodeList EOF {

        var file = $1;
        file += "module.exports = exports['default'] = exports['default'] || (function () {});"
        file += "Object.keys(exports).forEach(function (name) {"
        file += "    module.exports[name] = exports[name];"
        file += "});"

        /*
            this.push("abcd");
            this.push("efgh");
            =>
            this.push("abcdefgh");
        */
        file = file.replace(/\"\)\;\s*this\.push\(\"/g, '')
                   .replace(/\'\)\;\s*this\.push\(\'/g, '')

        return file;
    }
    ;

JemlNodeList
    : JemlNode              { $$ = $1 }
    | JemlNode JemlNodeList { $$ = $1 + $2 }
    ;

JemlNode
    : IfNode
    | TagNode
    | CallNode
    | EachNode
    | CondNode
    | CaseNode
    | MixinNode
    | StringNode
    | ImportNode
    | ExportNode
    | DefaultNode
    | CommentNode
    | DoctypeNode
    | StatementNode
    | ExpressionNode
    |

/*
IfNode
    : IF RawExpression BlockNode {
        $$ = "if(" + $2 + "){" + $3 + "}";
    }
    | IF RawExpression BlockNode ElseNode {
        $$ = "if(" + $2 + "){" + $3 + "}" + $4 + "}";
    }
    ;
*/

IfNode
    : '(' IF '[' JsExpression ']' THEN JemlNodeList ')'
    | '(' IF '[' JsExpression ']' THEN JemlNodeList ELSE JemlNodeList ')'
    ;

/*
TagNode
    : NAME                         { $$ = createTagNode($1, "", ""); }
    | NAME ':' InnerNode           { $$ = createTagNode($1, "", $3); }
    | NAME Attribute               { $$ = createTagNode($1, $2, ""); }
    | NAME Attribute ':' InnerNode { $$ = createTagNode($1, $2, $4); }
    ;

Attribute
    : '(' ')'               { $$ = ""; }
    | '(' AttributeList ')' { $$ = $2; }
    ;

AttributeList
    : AttributeNode
    | AttributeNode AttributeList     { $$ = $1 + $2; }
    | AttributeNode ',' AttributeList { $$ = $1 + $3; }
    ;

AttributeNode
    : NAME                { $$ = "this.push(' " + $1 + "');"; }
    | EXPRESSION          { $$ = "this.push(' ' + (" + $1.slice(1, -1) + "));"; }
    | NAME '=' RawString  { $$ = "this.push(' " + $1 + "=\"" + $3 + "\"');"; }
    | NAME '=' EXPRESSION { $$ = "this.push(' " + $1 + "=\"'+(" + $3.slice(1, -1) + ")+'\"');"; }
    ;

function createTagNode (tag, attribute, body) {
    return pushString("<" + tag)
         + attribute
         + pushString(">")
         + body
         + pushString("</" + tag + ">");
}

*/

TagNode
    : '(' NAME ')'
    | '(' NAME '/' ')'
    | '(' NAME AttributeNode ')'
    | '(' NAME AttributeNode '/' ')'
    | '(' NAME AttributeNode JemlNodeList ')'
    ;

/*

function createMixinNode (name, args, body) {
    return "function " + name + "(" + args + "){"
         +      body
         + "}";
}

*/

/*
    @name_of_called(exp, abc, `expression`)
    =>
    `name_of_called.call(this, exp, abc, expression)`

(+ name [exp, exp, exp])

*/
// call mixin
CallNode
    : '(' '+' NAME ')'
    | '(' '+' NAME '[' ExpressionList ']' ')'
    ;

/*

ForNode
    : FOR NAME IN RawExpression BlockNode {
        $$ = "this.each(" + $4 + "," + "function(" + $2 + "){" + $5 + "}, this);";
    }
    | FOR NAME ':' NAME IN RawExpression BlockNode {
        $$ = "this.each(" + $6 + "," + "function(" + $4 + "," + $2 + "){" + $7 + "}, this);";
    }
    ;

function createForNode (args, exp, body) {
    return "this.each(" + exp.slice(1, -1) + ",function(" + args + "){"
         +      body
         + "}, this);"
}

(:each [value, index, obj in expression]
)


// each node
(:each [value, index, obj in expression]
    (p abc)
    (p okk))
*/

EachNode
    : '(' EACH '[' NAME IN JsExpression ']' JemlNodeList ')'
    | '(' EACH '[' NAME ',' NAME IN JsExpression ']' JemlNodeList ')'
    | '(' EACH '[' NAME ',' NAME ',' NAME IN JsExpression ']' JemlNodeList ')'
    ;

/*

(:cond
    :when [expression]
        (p "...")
    :when [exp]
        (p "...")
    :else
        (p "...")
)

(:export name
    (html
        (head {:id 'something'} 'do something')
    )
)

*/

CondNode
    : '(' COND ')'
    ;

CaseNode
    :
    ;

MixinNode
    : MIXIN NAME BlockNode {
        $$ = createMixinNode($2, "", $3);
    }
    | MIXIN NAME Argument BlockNode {
        $$ = createMixinNode($2, $3, $4);
    }
    ;

/*

// string interpolation
// "Hi, my name is #{lastname} #{firstname}."
// => same as
// ("hi, my name is " + (lastname) + " " + (firstname) ".")

'love is everywhere '#(expression)' unless you sucks'
*/

sexp

StringNode
    :
    ;

/*
    (:import
        fs "abc"
        hi "./hi")
*/

ImportNode
    : '(' IMPORT NAME STRING ')' {
        $$ = "var " + $3 + " = require(" + $3 + ");";
    }
    | IMPORT '{' DestructureList '}' ImportPath {
        $$ = $3.split(',').map(function (names) {
            var name = names.split(' ')
            return 'var ' + name[1] + '= require(' + $5 + ')["' + name[0] + '"];'
        }).join('')
    }
    ;

DestructureList
    : DestructureName {
        $$ = $1;
    }
    | DestructureName ',' DestructureList {
        $$ = $1 + "," + $3;
    }
    ;

DestructureName
    : NAME {
        $$ = $1 + " " + $1
    }
    | NAME AS NAME {
        $$ = $1 + " " + $3
    }
    | DEFAULT AS NAME {
        $$ = $1 + " " + $3
    }
    ;

/*

function createExportNode (exportName, scopeName, args, body) {
    return "exports['" + exportName + "']=" + scopeName + ";"
         + createMixinNode(scopeName, args, body);
}

exports['name'] = name;
function name () {

}
(export 'name-of-string' []
    (html (...)))

*/

ExportNode
    : '(' EXPORT NAME '[' ']' JemlNodeList ')' {

    }
    ;

/*
    (:default []
        (html
            (head (title "I am title"))
            (body (p {hello}))))

    exports['default'] = name;
    function name () {...};

    (export default [x y z]
        (html
            (head 'I am okk')
        )
    )

*/
DefaultNode
    : '(' DEFAULT '[' Argument ']' JemlNodeList ')' {

    }
    | '(' DEFAULT NAME '[' Argument ']' JemlNodeList ')' {

    }
    ;

/*
    (:comment "Hi, I am just a commet")
    =>
    <!== ..... >
*/
CommentNode
    : '(' COMMENT JemlNodeList ')'
    ;


/*
# name something...
# okk to do something

% var name = 10
% if (x > 10) { ... }
*/

StatementNode
    : STATEMENT { $$ = $1.slice(1); } // % statement
    ;

// include !`expression` $"raw_string"
// {expression}
ExpressionNode
    : EXPRESSION { $$ = "this.push(" + $1.slice(1, -1) + ");"; }
    ;

/*
    used for EachNode, ExpressionNode, CondNode, ...

    literal: [], {}, /regexp/g
*/

JsExpression
    :
    ;

%%
