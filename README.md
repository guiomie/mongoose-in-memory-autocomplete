This module will:
1. Fetch from mongodb the data you wish to autocomplete
2. Insert this data in a prefix tree in memory

You can also bind data to a word inserted in the datastructure. 

Example: 

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
myMembersAutoComplete.getResults(prefix, function(err, words){
  if(err)
    res.json(err);
  else
    res.json(words);
});