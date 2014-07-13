
var Hogan = require('hogan.js');

var data = {
  screenName: "dhg",
};

var template = Hogan.compile("Follow @{{screenName}}.");
var output = template.render(data);

// prints "Follow @dhg."
console.log(output);
