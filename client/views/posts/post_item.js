Template.postItem.helpers({

    ownPost: function() {
        return this.userId == Meteor.userId();
    },
	domain: function() {
    	var a = document.createElement('a');
    	a.href = this.url;
    	return a.hostname;
  	},

	features: function() {
		return this.features;
	},

    tags: function() {
        return this.tags;
    },

    submitted: function() {
        return moment(this.submitted).startOf('minute').fromNow();
    },
    upvotedClass: function() {
        var userId = Meteor.userId();
        if (userId && !_.include(this.upvoters, userId)) {
            return 'btn-primary upvotable';
        }
       else if (userId && _.include(this.upvoters, userId)) {
            return 'voted cancelUpvote';
        }        
        else {
            return 'disabled';
        }
    },
    bookmarkedClass: function() {
        var postId = this._id;
        var user = Meteor.user();
        if (postId && user && !_.include(user.pages_saved, postId)) {
            return 'btn-primary pageBookmarkable';
        }        
        else {
            return 'disabled';
        }
    }    

});

Template.postItem.events({

    'click .upvotable': function(e){
        e.preventDefault();
        var post = this;
        if(!Meteor.user()){
            throwError("Please log in first");
        }
        Meteor.call('upvotePost', post._id);
    },

    'click .cancelUpvote': function(e){
        e.preventDefault();
        var post = this;
        if(!Meteor.user()){
            throwError("Please log in first");
        }
        Meteor.call('cancelUpvotePost', post._id);
    },
    
    'click .pageBookmarkable': function(e){
        e.preventDefault();
        var post = this;
        var user = Meteor.user();
        if(!user){
            throwError("Please log in first");
        }
        // .update({score: {$gt: 10}},
        //            {$addToSet: {badges: "Winner"}},
        //            {multi: true});
        Meteor.call('bookmarkPage', post._id);
    },    


});