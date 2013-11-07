Template.postSubmit.helpers({
    features: function() {
        return Features.find();
    }
});

Template.postSubmit.events({
    'submit form': function(e) {
        e.preventDefault();

        var features = [];

        $('input[name=feature]:checked').each(function() {
            features.push(Features.findOne($(this).val()));
        });

        tags = insertTags();

        var url = $(e.target).find('[name=url]').val();

        if(url){
            url = 
            (url.substring(0,7) === "http://" || url.substring(0,8) === "https://") ? url : "http://" + url;
        }
        

        var post = {
            url: url,
            title: $(e.target).find('[name=title]').val(),
            message: $(e.target).find('[name=message]').val(),
            features: features,
            tags: tags
        };

        Meteor.call('post', post, function(error, id){
            if(error) {
                throwError(error.reason);
            }
            Meteor.Router.to('postPage', id);
        });     
    }
});