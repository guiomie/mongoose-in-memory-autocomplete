var assert = require('assert');
var JSON2 = require('JSON2');
var Trie = require('./trie.js').Trie;
var getPrefixRoot = require('./trie.js').getPrefixRoot;

var trieTest = new Trie();

//Test Cases - Insertions in the trie
console.log("\n\n !---- Trie Insertion Tests ----! \n");

trieTest.addWord("Test");
assert.doesNotThrow(function(){
  trieTest.getDataStructure()
    .letters['T']
    .letters['e']
    .letters['s']
    .letters['t']
}, console.log("Test 1, Added word was in data structure."));
console.log("Pass !");

trieTest.addWord("Zola");
assert.doesNotThrow(function(){
  trieTest.getDataStructure()
    .letters['Z']
    .letters['o']
    .letters['l']
    .letters['a']
},  console.log("Test 2, Added word was in data structure."));
console.log("Pass !");

trieTest.addWord("Tesla");
assert.doesNotThrow(function(){
  trieTest.getDataStructure()
    .letters['T']
    .letters['e']
    .letters['s']
    .letters['l']
    .letters['a']
},  console.log("Test 3, Added word was in data structure."));
console.log("Pass !");

var lastNode = trieTest.getDataStructure()
  .letters['T']
  .letters['e']
  .letters['s']
  .letters['l']
  .letters['a'];

assert(lastNode.isEndOfWord,  console.log("Test 4, Verify last letter of word is flagged."));
console.log("Pass !");

var testDataValue = "idValue";
trieTest.addWordWithData("Zoom", { _id: testDataValue});

var expectedNode = trieTest.getDataStructure()
  .letters['Z']
  .letters['o']
  .letters['o']
  .letters['m'];

assert.equal(testDataValue, expectedNode.data._id,  console.log("Test 5, addWordWithData inserts node with data"));
console.log("Pass !");

//Test Cases - Find if prefix is in trie
console.log("\n\n !---- Prefix Retrieval Tests ----! \n");

var emptyRoot = getPrefixRoot("Toe", trieTest.getDataStructure());
assert.equal(emptyRoot, false, console.log("Test 5, Word not found returns false"));
console.log("Pass !");

var root = getPrefixRoot("Te", trieTest.getDataStructure());
var expectedRoot = trieTest.getDataStructure()
  .letters['T']
  .letters['e'];
assert.equal(root, expectedRoot, console.log("Test 6, Prefix root is found"));
console.log("Pass !");

trieTest.getWords("Toe", 10, function(result){
  assert.equal("No Matches", result, console.log("Test 7, Word not found returns error string"));
  console.log("Pass !");
});

trieTest.getWords("Te", 10, function(err, result){
  assert.equal("Test", result[0], console.log("Test 7(a), word Test was returned as suggestion"));
  console.log("Pass !");
  assert.equal("Tesla", result[1], console.log("Test 7(b), word Tesla was returned as suggestion"));
  console.log("Pass !");
});

trieTest.getWords("Tesla", 10, function(err, result){
  assert.equal("Tesla", result[0], console.log("Test 8, full word search returns proper discovery"));
  console.log("Pass !");
});

trieTest.getWords("Te", 1, function(err, result){
  assert.equal("Test", result[0], console.log("Test 8(a), max result returns 1 word"));
  console.log("Pass !");
  assert.equal(1, result.length, console.log("Test 8(a), max result returns array of length 1"));
  console.log("Pass !");
});

trieTest.getWordsWithData("Zoom", 10, function(err, result){
  assert.equal(1, result.length, console.log("Test 9(a), getWordsWithData returns data, 2 result"));
  console.log("Pass !");
  assert.equal(testDataValue, result[0].data._id, console.log("Test 9(b), getWordsWithData returns data, data is right"));
  console.log("Pass !");

});

//console.log(JSON2.stringify(trieTest.getDataStructure(), null, 2));