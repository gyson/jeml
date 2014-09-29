

%lex
%%

\s+                        /* skip whitespace        */
(\/\/).*                   /* skip comment           */
(\/\*)(.|\n|\r)*?(\*\/)    /* skip multiline comment */

// @ / # with a space
//"# ".*                                  return 'STATEMENT'

"%".*                                   return 'STATEMENT'

"'"("\\".|[^'])*"'"                     return 'SINGLE_QUOTE'
"\""("\\".|[^"])*"\""                   return 'DOUBLE_QUOTE'
"```"(("\\".|[\s\S])*?"```")            return 'TRIPLE_QUOTE'

/*
    | xxx
    | xxx
*/
//("| ".*\s*)+                          return 'BLOCK_QUOTE'

// regexp
"/"(("\\".|[\s\S])+?"/")(?:g|i|m|y)*    return 'REGEXP'
[0-9]+("."[0-9]+)?                      return 'NUMBER'

"import"                                return 'IMPORT'
"export"                                return 'EXPORT'
"default"                               return 'DEFAULT'
"in"                                    return 'IN'
"if"                                    return 'IF'
"else"                                  return 'ELSE'
"mixin"                                 return 'MIXIN'
"from"                                  return 'FROM'
"as"                                    return 'AS'
"each"                                  return 'EACH'
"then"                                  return 'THEN'
"when"                                  return 'WHEN'
"cond"                                  return 'COND'
"case"                                  return 'CASE'

// js keywords
"delete"                                return 'DELETE'
"typeof"                                return 'TYPEOF'
"void"                                  return 'VOID'
"instanceof"                            return 'INSTANCEOF'
"new"                                   return 'NEW'

[a-zA-Z_$][a-zA-Z_$0-9]*                return 'NAME'
[a-zA-Z_][a-zA-Z0-9_\-]*                return 'DASH_NAME' // e.g. data-user-name

//"#"[a-zA-Z_$][a-zA-Z_$0-9]*             return 'HASH_NAME'
//"."[a-zA-Z_$][a-zA-Z_$0-9]*             return 'DOT_NAME'

"#"                                     return '#'
"."                                     return '.'

","                                     return ','
":"                                     return ':'
"("                                     return '('
")"                                     return ')'
"{"                                     return '{'
"}"                                     return '}'
"!"                                     return '!'
"?"                                     return '?'

"&["                                    return '&['
"["                                     return '['
"]"                                     return ']'

"+"                                     return '+'
"-"                                     return '-'
"*"                                     return '*'
"/"                                     return '/'
"%"                                     return '%'
">="                                    return '>='
"<="                                    return '<='
">"                                     return '>'
"<"                                     return '<'
"==="                                   return '==='
"!=="                                   return '!=='
"=="                                    return '=='
"!="                                    return '!='
"="                                     return '='

"!"                                     return '!'

"."                                     return '.'
"&&"                                    return '&&'
"||"                                    return '||'


<<EOF>>                                 return 'EOF'

/lex

/* ... */

%left '||'
%left '&&'
%left '?' ':'
%left '<' '<=' '>' '>=' '==' '!=' '===' '!=='
%left '+' '-'
%left '*' '/' '%'
%right '!'

%start Template

%%


/*

*/
Template
    : EOF {
        return tail
    }
    | JemlNodeList EOF {
        return stringConcat($1 + tail)
    }
    ;

JemlNodeList
    : JemlNode
    | JemlNode JemlNodeList { $$ += $2 }
    ;

JemlNode
    : IfNode
    | TagNode
    | CallNode
    | EachNode
    | CondNode
    | CaseNode
    | TextNode
    | MixinNode
    | ImportNode
    | ExportNode
    | DefaultNode
    | StatementNode
    | ExpressionNode
    ;

/*
    if exp { ... }
    if exp { ... else ... }
    if exp { then ... else ... }
*/

IfNode
    : IF JsExpression '{' '}' {
        $$ = "if(" + $2 + "){}"
    }
    | IF JsExpression '{' JemlNodeList '}' {
        $$ = "if(" + $2 + "){" + $4 + "}"
    }
    | IF JsExpression '{' ElseBlock '}' {
        $$ = "if(" + $2 + "){}else{" + $4 + "}"
    }
    | IF JsExpression '{' ThenBlock ElseBlock '}' {
        $$ = "if(" + $2 + "){" + $4 + "}else{" + $5 + "}"
    }
    ;

ThenBlock
    : THEN {
        $$ = ""
    }
    | THEN ':' {
        $$ = ""
    }
    | JemlNodeList {
        $$ = $1
    }
    | THEN JemlNodeList {
        $$ = $2
    }
    | THEN ':' JemlNodeList {
        $$ = $3
    }
    ;

ElseBlock
    : ELSE {
        $$ = ""
    }
    | ELSE ':' {
        $$ = ""
    }
    | ELSE JemlNodeList {
        $$ = $2
    }
    | ELSE ':' JemlNodeList {
        $$ = $3
    }
    ;

/*
    iframe#id.class.class(id='class' [] abc=[name] [abc]="hi")
*/

TagNode
    : TagName {
        $$ = createTagNode($1, "", "")
    }
    | TagName TagBlock {
        $$ = createTagNode($1, "", $2)
    }
    | TagName TagAttribute {
        $$ = createTagNode($1, $2, "")
    }
    | TagName TagAttribute TagBlock {
        $$ = createTagNode($1, $2, $3)
    }
    ;

TagBlock
    : '{' '}' {
        $$ = ""
    }
    | '{' JemlNodeList '}' {
        $$ = $2
    }
    | ':' JemlNode {
        $$ = $2
    }
    ;

/*
    tag name
*/

TagName
    : NAME {
        $$ = { name: $1 }
    }
    | NAME TagAttrLiteralList {
        $$ = { name: $1, id: $2.id, class: $2.class }
    }
    ;

TagAttrLiteralList
    : TagAttrLiteral {
        $$ = { id: $1.id, class: $1.class }
    }
    | TagAttrLiteral TagAttrLiteralList {
        $$ = { id: $1.id || $2.id, class: $1.class.concat($2.class) }
    }
    ;

TagAttrLiteral
    : '.' TagAttrName {
        $$ = { class: [$2] }
    }
    | '#' TagAttrName {
       $$ = { id: $1, class: [] }
    }
    ;

TagAttribute
    : '(' ')' {
        $$ = ""
    }
    | '(' TagAttributeList ')' {
        $$ = $2
    }
    ;

TagAttributeList
    : TagAttributeNode
    | TagAttributeNode TagAttributeList     {
        $$ = $1 + $2
    }
    | TagAttributeNode ',' TagAttributeList {
        $$ = $1 + $3
    }
    ;

/*
    abc([]=[] abc=[] [] []="abc" []='abc')
    // Attribute name
*/

TagAttributeNode
    : TagAttrName {
        $$ = pushString(" " + $1)
    }
    | TagAttrName '=' TagAttributeString {
        $$ = pushString(" " + $1 + "=\"") + pushString($3) + pushString("\"")
    }
    | ExpressionNode {
        $$ = pushString(" ") + pushExp($1) + pushString(" ")
    }
    | ExpressionNode '=' TagAttributeString {
        $$ = pushString(" ") + pushExp($1) + pushString("=\"") + pushString($3) + pushString("\"")
    }
    | ExpressionNode '=' ExpressionNode {
        $$ = pushString(" ") + pushExp($1) + pushString("=\"") + pushExp($3) + pushString("\"")
    }
    | TagAttrName '=' ExpressionNode {
        $$ = pushString(" " + $1 + "=\"") + pushExp($3) + pushString("\"")
    }
    ;

TagAttrName
    : DASH_NAME
    | NAME
    ;

TagAttributeString
    : SINGLE_QUOTE {
        $$ = $1.slice(1, -1)
    }
    | DOUBLE_QUOTE {
        $$ = $1.slice(1, -1).replace(/'(?!\\)/g, '\\\'')
    }
    | TRIPLE_QUOTE {
        $$ = $2.slice(3, -3)
    }
    ;

/*
    +(body)
    +(abc: x, y, z)
*/

CallNode
    : '+' '(' JsExpression ')' {
        $$ = ';(' + $3 + ').call(this);'
    }
    | '+' '(' JsExpression ':' ')' {
        $$ = ';(' + $3 + ').call(this);'
    }
    | '+' '(' JsExpression ':' JsExpressionList ')' {
        $$ = ';(' + $3 + ').call(this,' + $5.join(',') + ');'
    }
    ;

/*
    each name in exp {}
    each v, n in exp {}
*/

// EachNode
EachNode
    : EACH NameList IN JsExpression '{' JemlNodeList '}' {
        $$ = "this.each(" + $4 + ", function(" + $2.join(',') + "){"
           +     $6
           + "}, this);"
    }
    ;

/*
    cond {
    when JsExpress:

    when

    ELSE
    }
*/

CondNode
    : COND '{' '}' {
        $$ = ""
    }
    | COND '{' CondWhenNodeList '}' {
        $$ = $3.join(' else ')
    }
    | COND '{' ElseBlock '}' {
        $$ = ' if (true) {' + $3 + '}'
    }
    | COND '{' CondWhenNodeList ElseBlock '}' {
        $$ = $3.join(' else ') + 'else {' + $4 + '}'
    }
    ;

CondWhenNodeList
    : CondWhenNode {
        $$ = [$1]
    }
    | CondWhenNode CondWhenNodeList {
        $$ = [$1].concat($2)
    }
    ;

CondWhenNode
    : WHEN JsExpression ':' {
        $$ = ' if (' + $2 + ') {} '
    }
    | WHEN JsExpression ':' JemlNodeList {
        $$ = ' if (' + $2 + ') {' + $4 + '} '
    }
    ;

/*
    case { when x: ... when y: ... }
    case { when x: ... else ... }
*/

CaseNode
    : CASE JsExpression '{' '}' {
        $$ = 'switch (' + $2 + ') {}'
    }
    | CASE JsExpression '{' CaseWhenNodeList '}' {
        $$ = 'switch (' + $2 + ') {' + $4 + '}'
    }
    | CASE JsExpression '{' ElseBlock '}' {
        $$ = 'switch (' + $2 + ') { default: ' + $4 + '}'
    }
    | CASE JsExpression '{' CaseWhenNodeList ElseBlock '}' {
        $$ = 'switch (' + $2 + ') {' + $4 + ' default:' + $5 + '}'
    }
    ;

CaseWhenNodeList
    : CaseWhenNode
    | CaseWhenNode CaseWhenNodeList {
        $$ = $1 + $2
    }
    ;

CaseWhenNode
    : WHEN JsExpressionList ':' {
        $$ = $2.map(function (exp) {
            return 'case ' + exp + ': '
        }).join('') + 'break;'
    }
    | WHEN JsExpressionList ':' JemlNodeList {
        $$ = $2.map(function (exp) {
            return 'case ' + exp + ': '
        }).join('') + $4 + 'break;'
    }
    ;

/*
    &"escaped text node"
*/

TextNode
    : SINGLE_QUOTE {
        $$ = createTextNode($1)
    }
    | DOUBLE_QUOTE {
        $$ = createTextNode($1)
    }
    | TRIPLE_QUOTE {
        $$ = createTextNode($1)
    }
    | '&' SINGLE_QUOTE {
        $$ = createTextNode($1, true)
    }
    | '&' DOUBLE_QUOTE {
        $$ = createTextNode($1, true)
    }
    | '&' TRIPLE_DOUBLE {
        $$ = createTextNode($1, true)
    }
    ;

/*
    mixin name (a0, a1) {

    }
*/

MixinNode
    : MIXIN NAME '{' JemlNodeList '}' {
        $$ = createMixinNode($2, '()', $4)
    }
    | MIXIN NAME Argument '{' JemlNodeList '}' {
        $$ = createMixinNode($2, $3, $5)
    }
    ;

/*
    // import './layout' ? => var layout = require('./layout')
    import name "./path/to/module"
    import name from "./path"
    import { abc as ok, ef } "./path"
    import { abc as ok, ef } from ".path"
    import { "abcd-okk" as f } from './layout'
*/

ImportNode
    : IMPORT NAME ImportPath {
        $$ = "var " + $2 + " = require(" + $3 + ");";
    }
    | IMPORT '{' DestructureList '}' ImportPath {
        $$ = $3.map(function (name) {
            return 'var ' + name[0] + '= require(' + $5 + ')' + name[1] + ';'
        }).join('')
    }
    ;

DestructureList
    : DestructureName {
        $$ = [$1]
    }
    | DestructureName ',' DestructureList {
        $$ = [$1].concat($3)
    }
    ;

DestructureName
    : NAME {
        $$ = [$1, '.' + $1]
    }
    | NAME AS NAME {
        $$ = [$3, '.' + $1]
    }
    | DEFAULT AS NAME {
        $$ = [$3, '["default"]']
    }
    | SINGLE_QUOTE AS NAME {
        $$ = [$3, '[' + $1 + ']']
    }
    | DOUBLE_QUOTE AS NAME {
        $$ = [$3, '[' + $1 + ']']
    }
    ;

ImportPath
    : SINGLE_QUOTE
    | DOUBLE_QUOTE
    | FROM SINGLE_QUOTE { $$ = $2 }
    | FROM DOUBLE_QUOTE { $$ = $2 }
    ;

/*
    export name (a, b, c) { }
*/

ExportNode
    : EXPORT NAME '{' JemlNodeList '}' {
        $$ = createExportNode($2, $2, "()", $4)
    }
    | EXPORT NAME Argument '{' JemlNodeList '}' {
        $$ = createExportNode($2, $2, $3, $5)
    }
    ;

/*
    default (x, y, z) { }
*/

DefaultNode
    : DEFAULT '{' JemlNodeList '}' {
        $$ = createExportNode('default', null, "()", $3)
    }
    | DEFAULT Argument '{' JemlNodeList '}' {
        $$ = createExportNode('default', null, $2, $4)
    }
    | DEFAULT NAME '{' JemlNodeList '}' {
        $$ = createExportNode('default', $2, "()", $4)
    }
    | DEFAULT NAME Argument '{' JemlNodeList '}' {
        $$ = createExportNode('default', $2, $3, $5)
    }
    ;

Argument
    : '(' ')' {
        $$ = "()"
    }
    | '(' NameList ')' {
        $$ = "(" + $2.join(',') + ")"
    }
    ;

NameList
    : NAME {
        $$ = [$1]
    }
    | NAME ',' NameList {
        $$ = [$1].concat($3)
    }
    ;

StatementNode
    : STATEMENT {
        $$ = $1.slice(1); // % statement # ? abc expression
    }
    ;

/*
    [expression]
    &[expression]
*/

ExpressionNode
    : '[' JsExpression ']' {
        $$ = createExpressionNode($2)
    }
    | '&[' JsExpression ']' {
        $$ = createExpressionNode($2, true)
    }
    ;

/*
    with name(js-expression-list)
*/
JsExpressionList
    : JsExpression {
        $$ = [$1]
    }
    | JsExpression ',' JsExpressionList {
        $$ = [$1].concat($3)
    }
    ;

// basded on
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators
JsExpression
    : JsVariableExpression
    | JsUnaryExpression
    | JsBinaryExpression
    | JsTenaryExpression
    ;

JsVariableExpression
    : NAME
    | REGEXP
    | NUMBER
    | SINGLE_QUOTE
    | DOUBLE_QUOTE
    | JsArrayLiteral
    | JsObjectLiteral
    | '(' JsExpression ')' {
         $$ = $1 + $2 + $3
    }
    | JsVariableExpression "." NAME {
        $$ = $1 + $2 + $3
    }
    | JsVariableExpression "." Keywords {
        $$ = $1 + '[' + $3 + ']' + $3
    }
    | JsVariableExpression "[" JsExpression "]" {
        $$ = $1 + $2 + $3 + $4
    }
    | JsVariableExpression '(' ')' {
        $$ = $1 + $2 + $3
    }
    | JsVariableExpression '(' JsExpressionList ')' {
        $$ = $1 + $2 + $3.join(',') + $4
    }
    ;

JsUnaryExpression
    : JsUnaryOperator JsVariableExpression {
        $$ = $1 + ' ' + $2
    }
    ;

JsUnaryOperator
    : '!' | '+' | '-' | DELETE | TYPEOF | VOID | NEW
    ;

JsBinaryExpression
    : JsVariableExpression JsBinaryOperator JsVariableExpression {
        $$ = $1 + ' ' + $2 + ' ' + $3
    }
    | JsVariableExpression JsBinaryOperator JsUnaryExpression {
        $$ = $1 + ' ' + $2 + ' ' + $3
    }
    | JsVariableExpression JsBinaryOperator JsBinaryExpression {
        $$ = $1 + ' ' + $2 + ' ' + $3
    }
    | JsUnaryExpression JsBinaryOperator JsVariableExpression {
        $$ = $1 + ' ' + $2 + ' ' + $3
    }
    | JsUnaryExpression JsBinaryOperator JsUnaryExpression {
        $$ = $1 + ' ' + $2 + ' ' + $3
    }
    | JsUnaryExpression JsBinaryOperator JsBinaryExpression {
        $$ = $1 + ' ' + $2 + ' ' + $3
    }
    ;


JsBinaryOperator
    : '+' | '-' | '*' | '/' | '%' | '>' | '<'
    | '>=' | '<=' | '==' | '!=' | '===' | '!==='
    | '&&' | '||' | IN | INSTANCEOF
    ;

JsTenaryExpression
    : JsExpression '?' JsExpression ':' JsExpression  {
        $$ = $1 + $2 + $3 + $4 + $5
    }
    ;

JsArrayLiteral
    : '[' ']' {
        $$ = $1 + $2
    }
    | '[' JsExpressionList ']' {
        $$ = $1 + $2.join(',') + $3
    }
    ;

JsObjectLiteral
    : '{' '}' {
        $$ = $1 + $2
    }
    | '{' JsObjectPropertyList '}' {
        $$ = $1 + $2 + $3
    }
    ;

JsObjectPropertyList
    : JsObjectProperty {
        $$ = $1
    }
    | JsObjectProperty ',' JsObjectPropertyList {
        $$ = $1 + $2 + $3
    }
    ;

JsObjectProperty
    : NAME ':' JsExpression {
        $$ = "'" + $1 + "':" + $3
    }
    | Keywords ':' JsExpression {
        $$ = "'" + $1 + "':" + $3
    }
    | SINGLE_QUOTE ':' JsExpression {
        $$ = $1 + $2 + $3
    }
    | DOUBLE_QUOTE ':' JsExpression {
        $$ = $1 + $2 + $3
    }
    ;

Keywords
    : IMPORT | EXPORT | DEFAULT | IN | IF | ELSE
    | MIXIN | FROM | AS | EACH | THEN | WHEN | NEW
    | COND | CASE | DELETE | TYPEOF | VOID | INSTANCEOF
    ;

%%

//var concatAll = "console.log($$.length, $$); this.$ = $$.slice(1).join('')"; //

var tail = require('fs').readFileSync(__dirname + '/tail.js', 'utf8');
var escape = require('./util').escape;

// tag node

var selfClosingTags = {};
"area base br col command embed hr img input keygen link meta param source track wbr"
.split(' ').forEach(function (tag) {
    selfClosingTags[tag] = true;
});


/*
    tag: { name, id, class }

*/
function createTagNode (tag, attribute, body) {
    var tagNode = pushString("<" + tag.name)
                + (tag.id ? pushString(' id="' + tag.id + '"') : '')
                + ((tag.class && tag.class.length > 0) ? pushString(' class="' + tag.class.join(' ') + '"') : '')
                + attribute;
                //+ pushString(">");

    // this.closing()
    // take care with this.doctype ?
    if (tag.name in selfClosingTags) {
        return tagNode + pushString('/>')
        // may use <input ... /> ?
        // or <link ...></link>  ?
    } else {
        return tagNode + pushString('>')
             + body + pushString("</" + tag.name + ">")
    }
}

// no string interpolation support yet
function createTextNode (text, isEscaped) {
    var result = '';

    switch (text[0]) {
    case '\'':
        result += text.slice(1, -1)
        break
    case '"':
        result += text.slice(1, -1).replace(/'(?!\\)/g, '\\\'')
        break
    case '`':
        result += text.slice(3, -3)
        break;
    }

    result = result.replace(/\n/g, '\\n')

    // for <pre> <code> ... tags
    // use inline text
    /*
    pre {
    | hi, I am inline text
    | how are you ?
    | I am feeling good!
    &| I am escaped <hi>
    }
    */

    //console.log("result", result.split())

    if (isEscaped) {
        result = escape(result) // MAY BE WRONG HERE!
    }

    return pushString(result);
}

function createMixinNode (name, arg, body) {
    return 'function ' + name + arg + '{' + body + '};'
}

// for default / export node
function createExportNode (name, alias, arg, body) {
    if (alias) {
        return "exports['" + name + "']=" + alias + ";"
             + createMixinNode(alias, arg, body)
    } else {
        return "exports['" + name + "']= "
             + createMixinNode("", arg, body)
    }
}


function createExpressionNode (exp, isEscaped) {
    if (isEscaped) {
        return pushExp("this.escape(" + exp + ")")
    } else {
        return pushExp(exp)
    }
}

// customized code
/*
    :code
    | abc abc abc
    | efg efg efg
    | okk okk okk
    | efg efg efg

    :coffee
    | abc abc abc
    | abc abc abc
    | abc abc abc
    | abc abc abc

    :something
    | abc
    | abc
    | abc

    :comment
    | abc
    | abc
    | abc

    :doc
    | hi, I am ok

    script
        @js
        | function name (okk) {
        |     hi(okk)
        | }

*/

function pushExp (exp) {
    return "this.s += " + exp + ";"
}

function pushString (str) {
    return "this.s += '" + str + "';"
}

/*
    this.push += 'abcd';
    this.push += 'efgh';
    =>
    this.push += 'abcdefgh';
*/

function stringConcat (str) {
    return str
        .replace(/\";\s*this\.s \+\= \"/g, '')
        .replace(/\';\s*this\.s \+\= \'/g, '');
}
