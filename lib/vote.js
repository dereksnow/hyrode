(function() {
  // returns how much "power" a user's votes have
  var getVotePower = function(user){
    return (user && user.isAdmin) ? 5 : 1;
  };

  var hasUpvotedItem = function(user, collection, id){
    // see http://www.mongodb.org/display/DOCS/MongoDB+Data+Modeling+and+Rails
    // 'is there an item with this id which contains this userId in its upvoters?'
    // if such an item  exists, it means we have voted.
    return collection.findOne({_id: id, upvoters: user._id}) !== undefined;
  }

  var upvote = function(collection, id, user) {
    // if no user is specified, use current user by default
    var user = (typeof user === 'undefined') ? Meteor.user() : user;

    if (!user || hasUpvotedItem(user, collection, id)) {
      return false;
    }

    var votePower=getVotePower(user);
    var votedItem = collection.findOne(id);
    var vote = 1;

    // Votes & Score
    collection.update({_id: id},{
      $addToSet: {upvoters: user._id},
      $inc: {votes: vote, baseScore: votePower},
      $set: {inactive: false}
    });
    if(!this.isSimulation) {
      updateScore(collection, id, true);
    }
    return true;
  };



  var cancelUpvote = function(collection, id, user) {
    // if no user is specified, use current user by default
    var user = (typeof user === 'undefined') ? Meteor.user() : user;

    if (! user || ! hasUpvotedItem(user, collection, id))
      return false
    
    var votePower=getVotePower(user);
    var votedItem = collection.findOne(id);
   
    // Votes & Score
    collection.update({_id: id},{
      $pull: {upvoters: user._id},
      $inc: {votes: -1, baseScore: -votePower},
      $set: {inactive: false}
    });
    if(!this.isSimulation)
      updateScore(collection, id, true);
    
    return true;
  };



  var getUser = function(user){
    // only let admins specify different users for voting
    // if no user is specified, use current user by default
    return (isAdmin(Meteor.user()) && typeof user !== 'undefined') ? user : Meteor.user();
  }
  
  Meteor.methods({
    upvotePost: function(postId, user){
      var user = getUser(user);
      // Calls a method of an object, substituting another object for the current object.
      return upvote.call(this, Posts, postId, user);
    },
    cancelUpvotePost: function(postId, user){
      var user = getUser(user);
      return cancelUpvote.call(this, Posts, postId, user);
    }
  });

})();