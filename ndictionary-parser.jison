
/* description: parsing NSArray/NSDictionary to JSON */

/* author: Sveinn Floki Gudmundsson */

/* lexical grammar */
%options flex case-insensitive
%lex
%%

\s+                       /* skip whitespace */
[0-9]+("."[0-9]+)?\b      return 'NUMBER'
\"[^"]*\"                 return "STRING";
\'[^']*\'                 return "STRING";
[A-Za-z]([A-Za-z0-9])*    return "STRINGVALUE"
"-"                       return '-'
"="                       return '='
";"                       return ';'
","                       return ','
"("                       return '('
")"                       return ')'
"{"                       return '{'
"}"                       return '}'
<<EOF>>                   return 'EOF'
.                         return 'INVALID'

/lex

%% /* language grammar */

NSObject
    : '(' Objects ')' EOF
        {return '[' + $2 + ']'}
    |  Object EOF
        {return $1}
    ;

InnerNSObject
    : '(' Objects ')'
        {$$ = '[' + $2 + ']'}
    | Object
        {$$ = $1}
    ;

Objects
    : Objects ',' Object
        {$$ = $1 + ',' + $3}
    | Object
        {$$ = $1}
    | Objects ',' var
        {$$ = $1 + ',' + $3}
    | var
        {$$ = $1}
    ;

Object
    : '{' Assignments '}'
        {$$ = '{' + $2 + '}'}
    | '{' '}'
        {$$ = '{}'}
    ;

Assignments
    : Assignments Assignment
        {$$ = $1 + ',' + $2}
    | Assignment
        {$$ = $1}
    ;

Assignment
    : keyname '=' value ';'
        {$$ = $1 + ':' + $3}
    ;

value
    : InnerNSObject
        {$$ = $1}
    | var
        {$$ = $1}
    ;

var
    : num
        {$$ = $1}
    | STRING
        {$$ = String(yytext).replace(/\\/g, "%")}
    | STRINGVALUE
        {$$ = '"' + String(yytext) + '"'}
    ;

num
    : '-' NUMBER
        {$$ = '-' + String(yytext)}
    | NUMBER
        {$$ = String(yytext)}
    ;

keyname
    : STRINGVALUE
        {$$ = '"' + String(yytext) + '"'}
    | STRING
        {$$ = String(yytext).replace(/\\/g, "%")}
    ;
