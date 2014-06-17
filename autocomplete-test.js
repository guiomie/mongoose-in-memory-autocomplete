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
  var autoCompleteInstance = new Autocomplete(NamesModel, testSequence);
  
  function testSequence(){
    try{
      console.log("Test 1. Constructor Validation - Size is right.");
      var elementsInCache = autoCompleteInstance.getCacheSize();
      assert.equal(testNames.length, elementsInCache, "Cache size returned invalid");
      console.log("Pass !");
      
     
      autoCompleteInstance.getResults("Mar", function(err, res){
        var testMsg = "Test 2. Constructor Validation- Retrieve word. "
        console.log(testMsg);
        if(err)
          console.log("Callback returned an error: " + err);
          
        assert.equal(res[0].word, "Marco Polo", "Wrong value returned");
        assert.equal(res[1].word, "Marcus Aurélius", "Wrong value returned");
        console.log("Pass !");
        //asyncTestsCount--;
        
      });
      
      while(asyncTests !== 0){
        //Block main thread for all callbacks to return
      }
      
    }
    catch(err){
      //asyncTestsCount = 0;
      if(err)
        console.log("Test threw error, Error: " + JSON.stringify(err));
    }

    //Tear Down
    console.log("\n!--- Tearing down Test ---!");
    testTearDown();
    
  };

});

function testTearDown(){
  NamesModel.remove({}, function(err) { 
      console.log('Collection removed') 
    });
};