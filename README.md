## A Mongoose in-memory autocomplete

This module will:
* Fetch from mongodb the data you wish to autocomplete and insert this data in a prefix tree in memory.
* Return all words starting with the requested string (autocomplete)
* You can also bind data to a word inserted in the datastructure. (ex: an indexed id)

## History

1.1 -> Now supports case sensitivity. Ex: mar or Mar both would return Marcus

## Test

1. Have mongodb running
2. Run tests (node ....js):
	autocomplete-test.js
	autocomplete-test-ignore-uppercase.js
	autocomplete-test-inverted-names.js
	fullname-autocomplete-test.js

## Usage

```

//A Mongoose configuration is required
var membersSchema = Schema({
	firstName : { type: String, required: true},
	lastName : { type: String, required: true }
});

var MembersModel = mongoose.model('MembersModel', membersSchema);

// Autocomplete configuration
var configuration = {
	//Fields being autocompleted, they will be concatenated
	autoCompleteFields : [ "firstName", "lastName"],
	//Returned data with autocompleted results
	dataFields: ["_id"],
	//Maximum number of results to return with an autocomplete request
	maximumResults: 10,
	//MongoDB model (defined earlier) that will be used for autoCompleteFields and dataFields
	model: MembersModel
}

//initialization of AutoComplete Module
var myMembersAutoComplete = new AutoComplete(configuration, function(){
  //any calls required after the initialization
  console.log("Loaded " + myMembersAutoComplete.getCacheSize() + " words in auto complete");
});

//Finding in the autocomplete
//
// Lets say we have in mongodb a document -> { firstName : "James", lastName: "Green", _id: "535f06a28ddfa3880f000003"}
// getResults will return words -> [{"word": "James Green","data": ["535f06a28ddfa3880f000003"]}]
//
myMembersAutoComplete.getResults("Jam", function(err, words){
  if(err)
    res.json(err);
  else
    res.json(words);
});

```
