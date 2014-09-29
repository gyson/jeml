 'use strict';
 exports['default'] = function(obj) {
     this.push += ('<div><h1 class="header">')
      + (obj.header)
      + ('</h1><h2 class="header2">')
      + (obj.header2)
      + ('</h2><h3 class="header3">')
      + (obj.header3)
      + ('</h3><h4 class="header4">')
      + (obj.header4)
      + ('</h4><h5 class="header5">')
      + (obj.header5)
      + ('</h5><h6 class="header6">')
      + (obj.header6)
      + ('</h6><ul class="list">');
     var list = obj.list;
     for (var i = 0, l = list.length; i < l; i++) {
         var item = list[i];
     //this.each(obj.list, function(item) {
         this.push += ('<li class="item">')
          + (item)
          + ('</li>');
     }//, this);
     this.push += ('</ul><ul class="list">');
    // this.each(obj.projects, function(project) {
     var projects = obj.projects;
     for (var i = 0, l = projects.length; i < l; i++) {
        var project = projects[i];
         this.push += ('<li class="item">')
         + (project.name)
         + (project.description)
         + ('</li>')
     }//, this);
     this.push += ('</ul></div>');
 };

 function hi(name) {
     this.push += ('<p>');
     this.push += (name);
     this.push += ('</p>');
     while (abc) {
         this.push += ('<p></p>');
     }
     this.push += ('<script></script>');
 };
 module.exports = exports['default'] = exports['default'] || (function() {});
 Object.keys(exports).forEach(function(name) {
     module.exports[name] = exports[name];
 });
