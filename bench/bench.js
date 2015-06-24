'use strict';

var fs = require('fs')
var path = require('path')
var Benchmark = require('benchmark')

var dot = require('dot')
var ejs = require('ejs')
var handlebars = require('handlebars')
var jade = require('jade')
var jeml = require('..')

var suite = new Benchmark.Suite();

var DATA = require('./small/small-data')

var dotSource = fs.readFileSync(path.join(__dirname, './small/small.dot'), 'utf8')
var dotFn = dot.compile(dotSource)

suite.add('dot', function() {
    return dotFn(DATA)
})

var ejsSource = fs.readFileSync(path.join(__dirname, './small/small.ejs'), 'utf8')
var ejsFn = ejs.compile(ejsSource)

suite.add('ejs', function() {
    return ejsFn(DATA)
})

var hdbSource = fs.readFileSync(path.join(__dirname, './small/small.handlebars'), 'utf8')
var hdbFn = handlebars.compile(hdbSource)

suite.add('handlebars', function() {
    return hdbFn(DATA)
})

var jadeSource = fs.readFileSync(path.join(__dirname, './small/small.jade'), 'utf8')
var jadeFn = jade.compile(jadeSource)

suite.add('jade', function () {
    return jadeFn(DATA)
})

var jemlFn = require('./small/small.jeml.js')

suite.add('jeml', function () {
    return jemlFn(DATA)
})

suite.on('cycle', function(event) {
  console.log(String(event.target))
})

suite.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'))
})

suite.run({ 'async': true })
