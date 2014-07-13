
/*

jeml abc.jeml
=> compile abc.js

jeml *.jeml
=> compile all to *.js

jeml abc.jeml efg.js
=> compile abc.jeml to efg.js

jeml abc.jeml # throw if syntax error


jeml fmt xxx

jeml render xxx@abc arguments... // call without arguments

jeml render xxx@abc "hello", 'abc', {abc: "okk", efg: "lll"}

*/
