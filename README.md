## A Mongoose in-memory autocomplete

This module will:
* Fetch from mongodb the data you wish to autocomplete.
* Insert this data in a prefix tree in memory.

You can also bind data to a word inserted in the datastructure. 

## Example 

```

//Mongoose configuration
var membersSchema = Schema({
	firstName : { type: String, required: true},
	lastName : { type: String, required: true }
});

var MembersModel = mongoose.model('MembersModel', membersSchema);

// Autocomplete configuration
var configuration = {
  autoCompleteFields : [ "firstName", "lastName"],
  dataFields: ["_id"],
  maximumResults: 10,
  model: MembersModel
}

var myMembersAutoComplete = new AutoComplete(configuration, function(){
  //any calls required after the initialization
  console.log("Loaded " + myMembersAutoComplete.getCacheSize() + " words in auto complete");
});

//Finding in the autocomplete
//
// Lets say we have in mongodb a document -> { firstName : "James", lastName: "Green", _id: "535f06a28ddfa3880f000003"}
// getResults will return words -> [{"word": "gfgfnf2 gnfhdh2","data": ["535f06a28ddfa3880f000003"]}]
//
myMembersAutoComplete.getResults("Jam", function(err, words){
  if(err)
    res.json(err);
  else
    res.json(words);
});

```