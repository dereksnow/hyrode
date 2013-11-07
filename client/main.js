newPostsHandle = Meteor.subscribeWithPagination('newPosts', 10);
bestPostsHandle = Meteor.subscribeWithPagination('bestPosts', 10);
Deps.autorun(function() {
    Meteor.subscribe('singlePost', Session.get('currentId'));
})
Meteor.subscribe('features');
Meteor.subscribe('tags');