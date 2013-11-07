Template.postEdit.helpers({
    post: function() {
        return Posts.findOne(Session.get('currentPostId'));
    },
    features: function(){
        var post = this;
        return Features.find().map(function(feature) {
          feature.checked = _.contains(_.pluck(post.features, '_id'), feature._id) ? 'checked' : '';
          return feature;
        });
    },
    tags: function() {
        var tags = [];
        for(var tag in this.tags)
        {
            tags.push(this.tags[tag].name);
        }
        return tags;
    }  
});

Template.postEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentPostId = Session.get('currentPostId');
        var features = [];

        $('input[name=feature]:checked').each(function() {
            var featureId = $(this).val();
            if(feature = Features.findOne(featureId)){
                features.push(feature);
            }
        });

        tags = insertTags();

        var postProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val(),
            features: features,
            tags: tags
        }

        Posts.update(currentPostId, {$set: postProperties}, function(error){
            if(error) {
                //display the error to the user
                alert(error.reason);                
            }
            else {
                Meteor.Router.to('postPage', currentPostId);
            }
        });
    },

    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Delete this post?")) {
            var currentPostId = Session.get('currentPostId');
            Posts.remove(currentPostId);
            Meteor.Router.to('postsList');
        }
    }
});