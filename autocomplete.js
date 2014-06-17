var Trie = require('./trie/trie.js').Trie;

var autoComplete = (function(){

  var cachedData = new Trie();
  var nbrCachedItems = 0;
  var maximumResults = 10;
  var configuration = {};
  
  var constructor = function(config, callback){
    configuration = config;
    buildCache(callback);
  };
  
  function buildCache(done){
    configuration.model.aggregate(buildAggregateQuery(), aggregateResult);
    
    function aggregateResult(err, docs){
      if(err){
        console.log("Error initializing autocomplete cache");
      }
      
      for(var i = 0; i < docs.length; i++){
        var wordWithData = buildInsertableData(docs[i]);
        console.log(wordWithData.word + " - " + wordWithData.data);
        console.log(JSON.stringify(wordWithData));
        cachedData.addWordWithData(wordWithData.word, wordWithData.data);
      }
      
      nbrCachedItems = docs.length;
      done();
    }
  };
  
  function buildInsertableData(doc){
   var word = "";
   var data = [];
   
    configuration.autoCompleteFields.forEach(function(item){
       if(word === ""){
        word = doc[item];
       }
       else{
        word += " " + doc[item];
       }
    });
    
    configuration.dataFields.forEach(function(item){
       data.push(doc[item]);
    });
    return {"word": word, "data": data};
  };
  
  function buildAggregateQuery(){
    var aggregateTemplate = [{ $project: {} }];
    
    configuration.autoCompleteFields.forEach(function(item){
      aggregateTemplate[0].$project[item] = 1;
    });
    
    configuration.dataFields.forEach(function(item){
       aggregateTemplate[0].$project[item] = 1;
    });
    return aggregateTemplate;
  };
  
  constructor.prototype = {
    getResults: function(string, resultCallback){
      cachedData.getWordsWithData(string, maximumResults, resultCallback);
    },
    getCacheSize: function(){
      return nbrCachedItems;
    }
  };
  
  return constructor;
})();

exports.AutoComplete = autoComplete;