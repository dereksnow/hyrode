Template.postEdit.helpers({
    // post: function() {
    //     return Posts.findOne(Session.get('currentPostId'));
    // },
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

        // this.resource contains the post object as
        // defined in router.js
        var currentPostId = this.resource._id;
        var features = [];

        $('input[name=feature]:checked').each(function() {
            var featureId = $(this).val();
            if(feature = Features.findOne(featureId)){
                features.push(feature);
            }
        });

        tags = insertTags();

        var properties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val(),
            features: features,
            tags: tags
        }

        if(this.bookmark) {
            properties.personal = $('#access').is(':checked');
            Meteor.call('pageBookmark', properties, function(error, id){
                if(error){
                    throwError(error.reason);
                }
                // change route to bookmarks page for user once implemented
                Router.go('home');
            });
        }
        else{
            Posts.update(currentPostId, {$set: properties}, function(error){
                if(error) {
                    //display the error to the user
                    alert(error.reason);                
                }
                else {
                    Router.go('postPage', {_id: currentPostId});
                }
            }); 
        }


   

    },

    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Delete this post?")) {
            var currentPostId = this._id;
            Posts.remove(currentPostId);
            Router.go('home');
        }
    }
});