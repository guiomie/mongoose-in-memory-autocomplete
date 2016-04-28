var assert = require('assert');
var mongoose = require('mongoose');
var testNames = require('./autocomplete-test-data.js').Names;
var NamesModel = require('./autocomplete-test-data.js').NamesModel;
var Autocomplete = require('./autocomplete.js').AutoComplete;

//
// This test validates that order in the autoCompleteFields is respected
// Thus having lastname declared first means traversing by the
// prefix tree's (or trie) lastname first letter
//
// This behavior is essential to build a bi-directional autocomplete
//

mongoose.connect('mongodb://localhost/autocomplete-test');

NamesModel.create(testNames, function (err, data) {
  if(err){
    console.log("Could not populate test database. Err: " + JSON.stringify(err));
  }

  var asyncTestsCount = 1;
  var configuration = {
    autoCompleteFields : ["lastName", "firstName"], // We invert the fields
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
      console.log("Passed !");

      autoCompleteInstance.getResults("Bar", function(err, res){
        process.stdout.write("Test 2. GetResults - Retrieve words for 'Bar'... ");

        if(err){
          console.log("Callback returned an error: " + err);
        }
        else{
          assert.equal(res[0].word, "Barrette Johnny", "Wrong value returned");
          assert.equal(res[1].word, "Bar Foo", "Wrong value returned");
          console.log("Passed !");
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
