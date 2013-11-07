//Local (client-only) collection
// The errors will only be pertinent
// to an individual user and don't 
// need to be synched/stored on the server
Errors = new Meteor.Collection(null);

// function that inserts errors into
// the Errors collection
throwError = function(message) {
    Errors.insert({message: message, seen: false});
}
clearErrors  = function() {
    Errors.remove({seen:true});
}