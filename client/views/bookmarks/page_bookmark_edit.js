Template.pageBookmarkEdit.helpers({
    bookmark: function() {
        return Posts.findOne(Session.get('currentPageBookmarkId'));
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

Template.pageBookmarkEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentPageBookmarkId = Session.get('currentPageBookmarkId');
        var features = [];

        $('input[name=feature]:checked').each(function() {
            var featureId = $(this).val();
            if(feature = Features.findOne(featureId)){
                features.push(feature);
            }
        });

        var tags = insertTags();

        var personal = $('#access').is(':checked');

        var properties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val(),
            features: features,
            tags: tags,
            personal: personal
        }


        Meteor.call('pageBookmark', properties, function(error, id){
            if(error){
                throwError(error.reason);
            }
            // change route to bookmarks page for user once implemented
            Meteor.Router.to('home');
        })
    },

    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Delete this post?")) {
            var currentPageBookmarkId = Session.get('currentPageBookmarkId');
            PageBookmarks.remove(currentPageBookmarkId);
            Meteor.Router.to('home');
        }
    }
});