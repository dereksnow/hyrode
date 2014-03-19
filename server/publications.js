// Meteor.publish('newPosts', function(options) {
//   return Posts.find({}, options);
// });
// Meteor.publish('bestPosts', function(options){
//     //return Posts.find({}, {sort: { votes: -1, submitted: -1}, limit: limit});
//     return Posts.find({}, options);
// });
Meteor.publish('posts', function(options) {
  return Posts.find({}, options);
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

Meteor.publish('links', function() {
    return Links.find();
});

Meteor.publish('pageBookmarks', function() {
    return PageBookmarks.find();
});