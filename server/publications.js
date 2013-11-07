Meteor.publish('newPosts', function(limit) {
  return Posts.find({}, {sort: {submitted: -1}, limit: limit});
});
Meteor.publish('bestPosts', function(limit){
    return Posts.find({}, {sort: { votes: -1, submitted: -1}, limit: limit});
});
Meteor.publish('singlePost', function(id) {
    return id && Posts.find(id);
});

Meteor.publish('features', function() {
  return Features.find();
});

Meteor.publish('tags', function() {
  return Tags.find();
});


