//
// Bi-directional fullname autoComplete
// Will return a mix of first or last name starting with input string
//

var Autocomplete = require('./autocomplete.js').AutoComplete;

var fullnameAutocomplete = (function(){
  var firstNameAutoComplete;
  var lastNameAutoComplete;
  var duplicateHint;

  var constructor = function(config, done){
    duplicateEntryHint = config.duplicateHint;

    InitFirstNameAutoComplete(config, function(err){
      if(err){
        done(err);
      }
      else{
        InitLastNameAutoComplete(config, function(){
          done();
        });
      }
    });
  };

  function InitFirstNameAutoComplete(config, callback){
    var configuration = {
      autoCompleteFields : [config.firstNameParam, config.lastNameParam],
      dataFields: [config.dataFields],
      maximumResults: config.maximumResults,
      model: config.model
    };
    firstNameAutoComplete = new Autocomplete(configuration, callback);
  }

  function InitLastNameAutoComplete(config, callback){
    var configuration = {
      autoCompleteFields : [config.lastNameParam, config.firstNameParam],
      dataFields: [config.dataFields],
      maximumResults: config.maximumResults,
      model: config.model
    };
    lastNameAutoComplete = new Autocomplete(configuration, callback);
  }

  function CompileResults(firstNameResults, lastNameResults){
    var itemsAlreadyReturned = {};
    var finalResults = [];

    firstNameResults.forEach(function(item){
      FlagAsAlreadyResulted(item);
    });

    lastNameResults.forEach(function(item){
      if(!itemsAlreadyReturned[item[duplicateEntryHint]]){
        FlagAsAlreadyResulted(item);
      };
    });

    return finalResults;

    function FlagAsAlreadyResulted(item){
      itemsAlreadyReturned[item[duplicateEntryHint]] = true;
      finalResults.push(item);
    }
  }

  constructor.prototype = {
    getResults: function(string, cb){
      firstNameAutoComplete.getResults(string, function(err, firstNameResults){
        if(err)
          cb(err);

        lastNameAutoComplete.getResults(string, function(err, lastNameResults){
          if(err)
            cb(err);

          cb(null, CompileResults(firstNameResults, lastNameResults));
        });
      });
    }
  };

  return constructor;
})();

exports.FullnameAutoComplete = fullnameAutocomplete;
