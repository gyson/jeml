

%lex
%%

\s+                     // skip whitespace
"# ".*                  // skip comment

"\""("\\".|[^"])*"\""   return 'STRING'

[a-zA-Z][a-zA-Z0-9]*    return 'NAME'

","                     return ','
":"                     return ':'
"("                     return '('
")"                     return ')'
"["                     return '['
"]"                     return ']'
"="                     return '='

<<EOF>>                 return 'EOF'

/lex //

%start Template

%%

Template
    : ElementList EOF
        {
            console.log($1);
            return $1;
        }
    ;

ElementList
    : Element ElementList
        { $$ = $1 + $2 }
    | Element
        { $$ = $1 }
    ;

Element
    : STRING
    | NAME ':' STRING
        { $$ = "<" + $1 + ">" + $3 + "</" + $1 + ">\n" }
    | NAME ':' '(' ElementList ')'
        { $$ = "<" + $1 + ">\n" + $4 + "</" + $1 + ">\n" }
    ;

%%




