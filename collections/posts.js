Posts = new Meteor.Collection('posts');
Features = new Meteor.Collection('features');
Tags = new Meteor.Collection('tags');
Ratings = new Meteor.Collection('ratings');

// Tags.allow({
//  insert: function(userId, doc) {
//      Tags.find
//      _.without(fields, '_id', 'name', 'creator').length > 0
//      return Meteor.user();
//  }
// });

// Tags.deny({
//  insert: function
// });

Posts.allow({
    update: function (userId, doc, fields, modifier) {
        // can only change your own documents
        return doc && doc.userId === userId;
    },
    remove: function(userId, doc) {
        // can only remove your own documents
        return doc && doc.userId === userId;
    }
});

Posts.deny({
    update: function(userId, doc, fields) {
        // may only edit the following fields:
        return (_.without(fields, 'url', 'title', 'features', 'tags').length > 0);
    }
});

// methods bypass allow and deny
Meteor.methods({

    tagInsert: function(tagObj) {
        var user = Meteor.user();

        // ensure the user is logged in
        if (!user) {
            throw new Meteor.Error(401, "You need to signin to post content");
        }   

        // pick out the whitelisted keys
        var tag = _.pick(tagObj, '_id', 'name');

        var tagId = Tags.insert(tag, function(error, result){
            if(error && (error.reason.indexOf("Duplicate") == -1)) {
                throwError(error.reason);
            }
            
        });

        return tagId;

    },

    rate: function(ratingProp){
        var user = Meteor.user();
        var postId = ratingProp.postId;
        var post = Posts.findOne({_id: postId});
        var rateVal = ratingProp.rateVal;

        // ensure the user is logged in
        if (!user) {
            throw new Meteor.Error(401, "You need to signin to rate.");
        }

        // ensure rating has rateVal
        if (!rateVal){
            throw new Meteor.Error(422, "No rating provided.");
        }

        // ensure rating has a post
        if (!post){
            throw new Meteor.Error(422, "Rating not associated with a post.");
        }

        // rate = _.extend(
        //          _.pick(
        //              ratingProp, 'postId', 'rateVal'),
        //          {
        //              userId: user._id
        //          }
        //      );

        // 
        var rating = Ratings.findOne({userId: user._id, postId: postId});
        
        // Hack to calculate rating averages 
        // Should be rewritten when Meteor formally supports aggregation
        
        // These changeInX vars allow updates to occur without double
        // summing or double counting upon incrementing.
        var changeInRating = rateVal;
        var changeInCount = 1;
        if(rating){
            changeInRating = rateVal - rating.rateVal;
            changeInCount = 0;
        }

        Ratings.upsert({userId: user._id, postId: postId}, 
                        {$set: { rateVal: rateVal }}
        );
        
        // maintain sum and count of ratings in post and calculate avg
        Posts.update({_id: postId},
                    {$inc: {ratingSum:changeInRating, ratingCount:changeInCount}});


        post = Posts.findOne({_id: postId});
        var avgRating = post.ratingSum / post.ratingCount; 

        Posts.update({_id: postId},
            {$set: {rating: avgRating}});

    },

    post: function(postAttributes) {
        var user = Meteor.user();

        // ensure the user is logged in
        if (!user) {
            throw new Meteor.Error(401, "You need to signin to post content");
        }

        // ensure the post has a title
        if(!postAttributes.title) {
            throw new Meteor.Error(422, 'Please provide a title');
        }

        var timeSinceLastPost=timeSinceLast(user, Posts);
        var numberOfPostsInPast24Hours=numberOfItemsInPast24Hours(user, Posts);
        var postInterval = 30;
        var maxPostsPer24Hours = 50;        

        if(!isAdmin(Meteor.user())){
          // check that user waits more than X seconds between posts
          if(!this.isSimulation && timeSinceLastPost < postInterval)
            throw new Meteor.Error(604, 'Please wait ' + (postInterval - timeSinceLastPost) + ' seconds before posting again');

          // check that the user doesn't post more than Y posts per day
          if(!this.isSimulation && numberOfPostsInPast24Hours > maxPostsPer24Hours)
            throw new Meteor.Error(605, 'Sorry, you cannot submit more than ' + maxPostsPer24Hours + ' posts per day');
        }        

        // pick out the whitelisted keys
        var post = _.extend(_.pick(postAttributes, 'url', 'title', 'message', 'features', 'tags'),
        {
            userId: Meteor.userId(),
            author: user.username,
            submitted: new Date().getTime(),
            baseScore: 0,
            score: 0,
            rating: undefined,
            ratingCount: 0,
            ratingSum: 0,
            upvoters: [],
            votes: 0,
            inactive: false

        });

        var postId = Posts.insert(post);

        var postAuthor =  Meteor.users.findOne(post.userId);
        Meteor.call('upvotePost', postId, postAuthor);        

        return postId;

    }
});