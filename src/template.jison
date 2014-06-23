

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

[a-zA-Z][a-zA-Z0-9]*       return 'NAME'

","                        return ','
":"                        return ':'
"("                        return '('
")"                        return ')'
"{"                        return '{'
"}"                        return '}'
"="                        return '='
"!"                        return '!'

<<EOF>>                    return 'EOF'

/lex

/* ... */

%start Template

%%

// OuterNodeList
Template
    : NodeList EOF            { return finalResult("", $1); }
    | ImportList NodeList EOF { return finalResult($1, $2); }
    ;

NodeList
    : Node
    | Node NodeList { $$ = $1 + ";" + $2; }
    ;

ImportList
    : ImportNode
    | ImportNode ImportList { $$ = $1 + "," + $2; }
    ;

ImportNode
    : IMPORT NAME SINGLE_QUOTE     { $$ = "\"" + $2 + "\":\"$require('" + $3.slice(1, -1) + "')\""; }
    | IMPORT NAME DOUBLE_QUOTE     { $$ = "\"" + $2 + "\":\"$require('" + $3.slice(1, -1) + "')\""; }
    | IMPORT NAME '!' SINGLE_QUOTE { $$ = "\"" + $2 + "\":\"$load('"    + $4.slice(1, -1) + "')\""; }
    | IMPORT NAME '!' DOUBLE_QUOTE { $$ = "\"" + $2 + "\":\"$load('"    + $4.slice(1, -1) + "')\""; }
    ;

ExportNode
    : EXPORT NAME BlockNode
    ;

OuterNode
    : MixinNode
    | ImportNode
    | ExportNode
    | DefaultNode
    ;

InnerNode
    : IfNode
    | TagNode
    | ForNode
    | BlockNode
    | MixinNode
    | StringNode
    | CommentNode // html comment
    | StatementNode
    | ExpressionNode
    ;

IfNode
    : IF RawExpression BlockNode                { $$ = "if(" + $2 + "){" + $3 + "}"; }
    | IF RawExpression BlockNode ELSE IfNode    { $$ = "if(" + $2 + "){" + $3 + "} else " + $5; }
    | IF RawExpression BlockNode ELSE BlockNode { $$ = "if(" + $2 + "){" + $3 + "} else {" + $5 + "}"; }
    ;

TagNode
    : NAME                    { $$ = createTagNode($1, "", ""); }
    | NAME ':' Node           { $$ = createTagNode($1, "", $3); }
    | NAME Attribute          { $$ = createTagNode($1, $2, ""); }
    | NAME Attribute ':' Node { $$ = createTagNode($1, $2, $4); }
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

EachNode
    : EACH NAME IN EXPRESSION BlockNode          { $$ = createEachNode($2, $4, $5); }
    | EACH NAME ',' NAME IN EXPRESSION BlockNode { $$ = createEachNode($2+","+$4, $6, $7); }
    ;

BlockNode
    : '{' '}'          { $$ = ""; }
    | '{' NodeList '}' { $$ = $2; }
    ;

MixinNode
    : MIXIN NAME BlockNode          { $$ = createMixinNode($2, "", $3); }
    | MIXIN NAME Argument BlockNode { $$ = createMixinNode($2, $3, $4); }
    ;

Argument
    : '(' ')'          { $$ = ""; }
    | '(' NameList ')' { $$ = $2; }
    ;

NameList
    : NAME
    | NAME ',' NameList { $$ = $1 + "," + $3; }
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
    : STATEMENT { $$ = ""; } // % statement
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

function createTagNode (tag, attribute, body) {
    return pushString("<" + tag)
         + attribute
         + pushString(">")
         + body
         + pushString("</" + tag + ">");
}

function createEachNode (args, exp, body) {
    return "go.each(" + exp.slice(1, -1) + ",function(" + args + "){"
         +      body
         + "});"
}

function createMixinNode (name, args, body) {
    return "function " + name + "(" + args + "){"
         + "    var __l = [], __p = function (x) { __l.push(x) }; "
         +      body
         + "    return __l.join(''); "
         + "};";
}

function createStringNode (string) {
    return pushString(replaceEscapeCharacters(string));
}

/*
go.parallel([$require("xxx"), $load("xxx")])]).then(function () {
    var xxx = argument[0][0];
    var yyy = argument[0][1];
    var zzz = argument[0][2];

    // body
    $export(function () {
        with (arguments[0]) {
            return ((function () {
                'use strict';
                var __l = [], __p = function (x) { __l.push(x); };

                // body of script

                return __l.join('');
            })());
        }
    });
}, function () { throw new Error("Cannot ...")});
*/

function finalResult (imports, body) {
    // handle imports
    // imports: "xxx": "require('xxx')
    var toImports = JSON.parse("{" + imports + "}");

    var scriptHead, scriptBody, scriptTail;

    var keys = Object.keys(toImports);

    if (keys.length > 0) {
        scriptHead = "go.yield(go.parallel([" + keys.map(function (key) { return toImports[key] }).join(',') + "]), function () {"
                   + "    if (arguments[0]) throw arguments[0];"
                   +      keys.map(function (key, i) { return "var " + key + "=arguments[1][" + i + "]" }).join(";") + ";";
    } else {
        scriptHead = "";
    }

    scriptBody = "$export(function () {"
               + "    arguments[0] = arguments[0] || {}; "
               + "    with (arguments[0]) {"
               + "        return ((function () {"
               + "            'use strict';     "
               + "            var __l = [], __p = function (x) { __l.push(x); };"
               +              body
               + "            return __l.join('');"
               + "        })());"
               + "    }"
               + "});"

    scriptTail = keys.length > 0 ? "});" : "";

    var script = scriptHead + scriptBody + scriptTail;

    //console.log(script);
    return script;
}
