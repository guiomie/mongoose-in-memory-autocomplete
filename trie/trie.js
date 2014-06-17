/*
  Basic Trie Datastructure
  
  1. Supports having data attached to insert word
  
*/

var trie = function(){
  var trieRoot = new Node(); 

  function insertLetter(node, word){
    var letterToAdd = word[0];
    var missingNode = new Node();
    
    if(typeof(node.letters[letterToAdd]) === 'undefined'){
      if(word.length === 1){
        missingNode.isEndOfWord = true;
        node.letters[letterToAdd] = missingNode;
        return node.letters[letterToAdd];
      }
      else{
        var truncatedWord = word.substring(1, (word.length));
        node.letters[letterToAdd] = missingNode;
        return insertLetter(missingNode, truncatedWord);
      }
    }
    else{
      if(word.length === 1){
        node.letters[letterToAdd].isEndOfWord = true;
        return node.letters[letterToAdd];
      }
      else{
        var truncatedWord = word.substring(1, (word.length));
        return insertLetter(node.letters[letterToAdd], truncatedWord);
      }
    }
  };
  
  function discoverWords(string, maxResults, returnWithData){
    var prefixRoot = getPrefixRoot(string, trieRoot);
    var wordsFound = [];
    var wordBeingBuilt = string;
    var attachData = returnWithData;
    
    traverseNode(prefixRoot);
    return wordsFound;
    
    function traverseNode(node){
      if(wordsFound.length === maxResults){
        return;
      }
      
      if(node.isEndOfWord){
        if(attachData){
          wordsFound.push({ 
            word: wordBeingBuilt, 
            data: node.data
          });
        }
        else{
          wordsFound.push(wordBeingBuilt);
        }
      }
      
      for (var letter in node.letters) {
        var nextNode = node.letters[letter];
        wordBeingBuilt += letter;
        traverseNode(nextNode);
        wordBeingBuilt = wordBeingBuilt.substring(0, wordBeingBuilt.length - 1);
      }
    };
  };
  
  function getWordsReturnHandling(result, callback){
    if(result.length === 0){
        callback("No Matches")
      }
      else{
        callback(null, result)
      }
  };
  
  return {
    addWord: function(word){
      insertLetter(trieRoot, word);
    },
    addWordWithData: function(word, data){
      var lastLetterNode = insertLetter(trieRoot, word);
      lastLetterNode.data = data;
    },
    getWords: function(partialWord, maxResults, callback){
      var results = discoverWords(partialWord, maxResults);
      getWordsReturnHandling(results, callback);
    },
    getWordsWithData: function(partialWord, maxResults, callback){
      var results = discoverWords(partialWord, maxResults, true);
      getWordsReturnHandling(results, callback);
    },
    getDataStructure: function(){
      return trieRoot;
    }
  }
};

var getPrefixRoot = function(prefix, rootNode){
  var objectNavigation = rootNode;
  for(var i = 0; i < prefix.length; i++){
    if(typeof objectNavigation.letters[prefix[i]] === 'undefined'){
      return false;
    }
    objectNavigation = objectNavigation.letters[prefix[i]];
  }
  return objectNavigation;
};

var Node = function(){
  return {
    isEndOfWord: false,
    data : {},
    letters : new AlphabetSet()
  }
};

var AlphabetSet = function() {
  return {}
};

exports.Trie = trie;
exports.getPrefixRoot = getPrefixRoot;