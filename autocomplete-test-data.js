var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cacheModel = Schema({
	firstName : { type: String, required: true},
	lastName : { type: String, required: true }
});

var CacheModel = mongoose.model('CacheModel', cacheModel);

var testNameValues = [
  new CacheModel({
    firstName : 'Marco',
    lastName : 'Polo'
  }),
  new CacheModel({
    firstName : "Marcus",
    lastName : "Aurélius"
  }),
  new CacheModel({
    firstName : 'Foo',
    lastName : 'Bar'
  }),
  new CacheModel({
    firstName : 'Floyd',
    lastName : 'Brown'
  }),
	new CacheModel({
    firstName : 'Johnny',
    lastName : 'Barrette'
  }),
	new CacheModel({
    firstName : 'Aurelia',
    lastName : 'Djokstud'
  }),
  new CacheModel({
    firstName : 'Molly',
    lastName : 'West'
  })
]

exports.NamesModel = CacheModel;
exports.Names = testNameValues;
