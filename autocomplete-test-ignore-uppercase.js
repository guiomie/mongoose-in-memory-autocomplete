var assert = require('assert');
var mongoose = require('mongoose');
var testNames = require('./autocomplete-test-data.js').Names;
var NamesModel = require('./autocomplete-test-data.js').NamesModel;
var Autocomplete = require('./autocomplete.js').AutoComplete;

mongoose.connect('mongodb://localhost/autocomplete-test');

NamesModel.create(testNames, function (err, data) {
  if(err){
    console.log("Could not populate test database. Err: " + JSON.stringify(err));
  }

  var asyncTestsCount = 1;
  var configuration = {
    autoCompleteFields : [ "firstName", "lastName"],
    dataFields: ["_id"],
    maximumResults: 10,
    model: NamesModel
  }

  try{
    var autoCompleteInstance = new Autocomplete(configuration, testSequence);
  }
  catch(err){
    console.log("tearing down");
    testTearDown();
  }

  function testSequence(){
    try{
      process.stdout.write("Test 1. Constructor Validation - Size is right... ");
      var elementsInCache = autoCompleteInstance.getCacheSize();
      assert.equal(testNames.length, elementsInCache, "Cache size returned invalid");
      console.log("Pass !");

      autoCompleteInstance.getResults("mar", function(err, res){
        process.stdout.write("Test 2. GetResults - Retrieve words for 'mar '... ");

        if(err){
          console.log("Callback returned an error: " + err);
        }
        else{
          assert.equal(res[1].word, "Marco Polo", "Wrong value returned");
          assert.equal(res[0].word, "Marcus Aurélius", "Wrong value returned");
          console.log("Pass !");
        }

        testTearDown();
      });
    }
    catch(err){
      if(err)
        console.log("Test threw error, Error: " + JSON.stringify(err));
      testTearDown();
    }
  };
});

function testTearDown(){
  console.log("\n!--- Tearing down Test ---!");
  NamesModel.remove({}, function(err) {
      console.log('Collection removed')
    });
};
