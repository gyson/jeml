

%lex
%%

\s+                        /* skip whitespace        */
(\/\/).*                   /* skip comment           */
(\/\*)(.|\n|\r)*?(\*\/)    /* skip multiline comment */

"%".*                      return 'STATEMENT'
\`[^\`]*\`                 return 'EXPRESSION'

"|".*                      return 'STRING_TOKEN' // block string
"'"("\\".|[^'])*"'"        return 'SINGLE_QUOTE'
"\""("\\".|[^"])*"\""      return 'DOUBLE_QUOTE'

"import"                   return 'IMPORT'
"export"                   return 'EXPORT'
"default"                  return 'DEFAULT'
"for"                      return 'FOR'
"in"                       return 'IN'
"if"                       return 'IF'
"else"                     return 'ELSE'
"mixin"                    return 'MIXIN'
"from"                     return 'FROM'
"as"                       return 'AS'

[a-zA-Z_$][a-zA-Z_$0-9]*   return 'NAME'

","                        return ','
":"                        return ':'
"("                        return '('
")"                        return ')'
"{"                        return '{'
"}"                        return '}'
"="                        return '='
"!"                        return '!'
"%"                        return '%'

<<EOF>>                    return 'EOF'

/lex

/* ... */

%start Template

%%


/*


*/
// OuterNodeList
Template
    : OuterNodeList EOF {
        return appendHead + $1 + appendTail;
      }
    ;

OuterNodeList
    : OuterNode               { $$ = $1 }
    | OuterNode OuterNodeList { $$ = $1 + $2 }
    ;

OuterNode
    : MixinNode
    | ImportNode
    | ExportNode
    | DefaultNode
    | StatementNode
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
    import name "./path/to/module"
        => var name = require('path/to/module');
    import name from "./path"
    import { abc as ok, ef } "./path"
        => var _x = require('./path')
        => var ok = _x.abc
        => var ef = _x.ef
    import { abc as ok, ef } from ".path"
*/

ImportNode
    : IMPORT NAME ImportPath { 
        $$ = "var " + $2 + " = require(" + $3 + ");"; 
    }
    | IMPORT '{' DestructureList '}' ImportPath {
        var anony = createName();
        $$ = "var " + anony + " = require(" + $5 + ");"
           + $3.split(",").map(function (names) {
                var name = names.split(" ");
                return "var " + name[1] + "=" + anony + "." + name[0] + ";";
             }).join("");
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

ImportPath
    : SINGLE_QUOTE
    | DOUBLE_QUOTE
    | FROM SINGLE_QUOTE { $$ = $2 }
    | FROM DOUBLE_QUOTE { $$ = $2 }
    ;

ExportNode
    : ExportDeclaration NAME BlockNode {
        $$ = createExportNode($2, $2, "", $3);
    }
    | ExportDeclaration NAME Argument BlockNode {
        $$ = createExportNode($2, $2, $3, $4);
    }
    ;

ExportDeclaration
    : EXPORT
    | EXPORT MIXIN { $$ = $1 }
    ;

DefaultNode
    : DefaultDeclaration BlockNode {
        $$ = createExportNode("default", createName(), "", $2);
    }
    | DefaultDeclaration Argument BlockNode { 
        $$ = createExportNode("default", createName(), $2, $3);
    }
    | DefaultDeclaration NAME BlockNode {
        $$ = createExportNode("default", $2, "", $3);
    }
    | DefaultDeclaration NAME Argument BlockNode {
        $$ = createExportNode("default", $2, $3, $4);
    }
    ;

DefaultDeclaration
    : DEFAULT
    | DEFAULT MIXIN { $$ = $1 }
    ;

InnerNodeList
    : InnerNode
    | InnerNode InnerNodeList { $$ = $1 + $2; }
    ;

InnerNode
    : IfNode
    | TagNode
    | ForNode
    | BlockNode
    | MixinNode
    | StringNode
    //| CommentNode // html comment
    | StatementNode
    | ExpressionNode
    ;

/*
    if `expression` {

    } else if `expression` {

    } else `expression` {

    } else {

    }
*/

IfNode
    : IF RawExpression BlockNode { 
        $$ = "if(" + $2 + "){" + $3 + "}"; 
    }
    | IF RawExpression BlockNode ElseNode { 
        $$ = "if(" + $2 + "){" + $3 + "}" + $4 + "}"; 
    }
    ;

ElseNode
    : ELSE BlockNode {
        $$ = "else {" + $2 + "}";
    }
    | ELSE BlockNode ElseNode {
        $$ = "else {" + $2 + "}" + $3;
    }
    | ELSE RawExpression BlockNode {
        $$ = "else if (" + $2 + ") {" + $3 + "}";
    }
    | ELSE RawExpression BlockNode ElseNode {
        $$ = "else if (" + $2 + ") {" + $3 + "}" + $4;
    }
    | ELSE IF RawExpression BlockNode {
        $$ = "else if (" + $3 + ") {" + $4 + "}";
    }
    | ELSE IF RawExpression BlockNode ElseNode {
        $$ = "else if (" + $3 + ") {" + $4 + "}" + $5;
    }
    ;

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
    : NAME                { $$ = "__p(' " + $1 + "');"; }
    | EXPRESSION          { $$ = "__p(' ' + (" + $1.slice(1, -1) + "));"; }
    | NAME '=' RawString  { $$ = "__p(' " + $1 + "=\"" + $3 + "\"');"; }
    | NAME '=' EXPRESSION { $$ = "__p(' " + $1 + "=\"'+(" + $3.slice(1, -1) + ")+'\"');"; }
    ;

/*
    for name in exp {}
    for i: v in exp {}
    for exp {}
    for (var i = 0, len = exp.length; i < len; i++) {
        var name = exp[i];
    }
*/

ForNode
    : FOR RawExpression BlockNode {
        $$ = "while (" + $2 + ") {" + $3 + "}";
    }
    | FOR NAME IN RawExpression BlockNode { 
        $$ = "__each(" + $4 + "," + "function(" + $2 + "){" + $5 + "});";
    }
    | FOR NAME ':' NAME IN RawExpression BlockNode { 
        $$ = "__each(" + $6 + "," + "function(" + $4 + "," + $2 + "){" + $7 + "});";
    }
    ;

BlockNode
    : '{' '}'          { $$ = ""; }
    | '{' InnerNodeList '}' { $$ = $2; }
    ;


Argument
    : '(' ')'          { $$ = ""; }
    | '(' NameList ')' { $$ = $2; }
    ;

NameList
    : NAME
    | NAME ',' NameList { $$ = $1 + ", " + $3; }
    ;

// include !'string node'
StringNode
    : RawString { $$ = createStringNode($1); }
    ;

RawString
    : SINGLE_QUOTE { $$ = $1.slice(1, -1); }
    | DOUBLE_QUOTE { $$ = $1.slice(1, -1); }
    | STRING_TOKEN { $$ = $1.slice(1);     }
    ;

CommentNode
    : COMMENT { $$ = ""; }
    ;

StatementNode
    : STATEMENT { $$ = $1.slice(1); } // % statement
    ;

// include !`expression` $"raw_string"
ExpressionNode
    : EXPRESSION { $$ = "__p(" + $1.slice(1, -1) + ");"; }
    ;

RawExpression
    : EXPRESSION { $$ = $1.slice(1, -1); }
    ;

%%

function replaceEscapeCharacters (str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
}

function pushString (string) {
    return "__p('" + string + "');";
}

var id = 0;
// create anonymous name
function createName () {
    return "__" + id++;
}

// append to head of each module
// include __each, need to take care Object.ownProeprties.
var appendHead = "var __each = function(obj, iterator) {                        "
               + "    var i, length;                                            "
               + "    if (obj == null) return obj;                              "
               + "    if (obj.length === +obj.length) {                         "
               + "        for (i = 0, length = obj.length; i < length; i++) {   "
               + "            iterator(obj[i], i, obj);                         "
               + "        }                                                     "
               + "    } else {                                                  "
               + "        var keys = Object.keys(obj);                          "
               + "        for (i = 0, length = keys.length; i < length; i++) {  "
               + "            iterator(obj[keys[i]], keys[i], obj);             "
               + "        }                                                     "
               + "    }                                                         "
               + "    return obj;                                               "
               + "};                                                            ";

// append to the end of each template
var appendTail = "module.exports = (function () {                  "
               + "    if (exports.default) {                       "
               + "        var e = exports.default;                 "
               + "        __each(exports, function (value, name) { "
               + "            e[name] = value;                     "
               + "        });                                      "
               + "        return e;                                "
               + "    } else {                                     "
               + "        return exports;                          "
               + "    }                                            "
               + "}());                                            "
    
function createTagNode (tag, attribute, body) {
    return pushString("<" + tag)
         + attribute
         + pushString(">")
         + body
         + pushString("</" + tag + ">");
}

function createForNode (args, exp, body) {
    return "__each(" + exp.slice(1, -1) + ",function(" + args + "){"
         +      body
         + "});"
}

function createExportNode (exportName, scopeName, args, body) {
    return "exports." + exportName + "=" + scopeName + ";"
         + createMixinNode(scopeName, args, body);
}

function createMixinNode (name, args, body) {
    return "function " + name + "(" + args + "){"
         + "    var __l = [], __p = [].push.bind(__l); "
         +      body
         + "    return __l.join(''); "
         + "}";
}

function createStringNode (string) {
    return pushString(replaceEscapeCharacters(string));
}
