Template.postItemRating.rendered = function () {
    var post = Posts.findOne({_id: this.data._id});
    var linkId = post.linkId;
    var link = Links.findOne({_id: linkId});
    var avgRating = Math.round(link.rating);
    $(this.firstNode).find('.star_' + avgRating).prevAll().andSelf().addClass('ratings_vote');  
    $(this.firstNode).find('.star_' + avgRating).nextAll().removeClass('ratings_vote'); 
}


Template.postItemRating.events({

    'mouseenter .ratings_stars': function(e){

        e.preventDefault();

        $(e.target).prevAll().andSelf().addClass('ratings_over');
        $(e.target).nextAll().removeClass('ratings_vote');

    },

    'mouseleave .ratings_stars': function(e){

        e.preventDefault();

        $(e.target).prevAll().andSelf().removeClass('ratings_over');
        var post = Posts.findOne({_id: this._id});
        var link = Links.findOne({_id: post.linkId});
        var avgRating = Math.round(link.rating);
        $(e.target).parent().find('.star_' + avgRating).prevAll().andSelf().addClass('ratings_vote');  
        $(e.target).parent().find('.star_' + avgRating).nextAll().removeClass('ratings_vote');                                                     

    },    

    'click .ratings_stars': function(e){
        e.preventDefault();

        var matches = $(e.target).attr('class').match(/star_([1-5]{1})/);        
        var rateVal = parseInt(matches[1], 10);
        var postId = this._id;

        var ratingProp = {
            rateVal: rateVal,
            postId: postId
        };       

        Meteor.call('rate', ratingProp, function(error, id){
            if(error) {
                throwError(error.reason);
            }
        });

        var post = Posts.findOne({_id: postId});
        var link = Links.findOne({_id: post.linkId});
        var avgRating = Math.round(link.rating);
        $(e.target).parent().find('.star_' + avgRating).prevAll().andSelf().addClass('ratings_vote');  
        $(e.target).parent().find('.star_' + avgRating).nextAll().removeClass('ratings_vote');
    }    

});