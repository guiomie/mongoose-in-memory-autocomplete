var assert = require('assert');
var mongoose = require('mongoose');
var testNames = require('./autocomplete-test-data.js').Names;
var NamesModel = require('./autocomplete-test-data.js').NamesModel;
var FullnameAutoComplete = require('./fullname-autocomplete.js').FullnameAutoComplete;

mongoose.connect('mongodb://localhost/autocomplete-test');

NamesModel.create(testNames, function (err, data) {
  if(err){
    console.log("Could not populate test database. Err: " + JSON.stringify(err));
  }

  var configuration = {
    firstNameParam: "firstName",
    lastNameParam: "lastName",
    dataFields: "_id",
    maximumResults: 10,
    model: NamesModel,
    duplicateHint: "_id"
  }

  try{
    var fullnameAutoCompleteInstance = new FullnameAutoComplete(configuration, testSequence);
  }
  catch(err){
    console.log("Tearing down, error: " + JSON.stringify(err));
    testTearDown();
  }

  function testSequence(err){
    try{
      process.stdout.write("1. Testing first and last name are returned (starting with Aur)...");
      if(err){
        console.log("Fail !");
        console.log(JSON.stringify(err));
        testTearDown();
      }
      else{
        fullnameAutoCompleteInstance.getResults("Aur", function(err, res){
          console.log(JSON.stringify(res));
          process.stdout.write("  a. Returns last name 'Aurelius'... ");
          assert.equal(res[0].word, "Aurélius Marcus", "Wrong value returned");
          console.log("Passed !");
          process.stdout.write("  b. Returns first name 'Aurelia'... ");
          assert.equal(res[1].word, "Aurelia Djokstud", "Wrong value returned");
          console.log("Passed !");
          testTearDown();
        });
      }
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
