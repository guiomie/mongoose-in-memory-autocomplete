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
        done(err); //?
      }
      for(var i = 0; i < docs.length; i++){
        var wordWithData = buildInsertableData(docs[i]);
        cachedData.addWordWithData(wordWithData.word, wordWithData.data);
      }
      nbrCachedItems = docs.length;
      done(null);
    }
  };

  function buildInsertableData(doc){
    var word = "";
    var lowerCased = "";
    var data = [];

    configuration.autoCompleteFields.forEach(function(item){
      if(word === ""){
        lowerCased = doc[item].toLowerCase();
        word = doc[item];
      }
      else{
        lowerCased += " " + doc[item].toLowerCase();
        word += " " + doc[item];
      }
    });

    configuration.dataFields.forEach(function(item){
      data.push(doc[item]);
    });

    var itemToCache = {"word": lowerCased, "data": data};
    itemToCache.data.originalWord = word;
    return itemToCache;
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

  function RebuildToOriginalContent(content){
    var newarray = [];
    content.forEach(function(item){
      newarray.unshift({ word: item.data.originalWord, data: item.data});
    });
    return newarray;
  }

  constructor.prototype = {
    getResults: function(string, cb){
      cachedData.getWordsWithData(string.toLowerCase(), maximumResults, function(err, result){
        if(err){
          cb(err);
        }
        else{
          cb(null, RebuildToOriginalContent(result));
        }
      });
    },
    getCacheSize: function(){
      return nbrCachedItems;
    }
  };

  return constructor;
})();

exports.AutoComplete = autoComplete;
