Router.configure({
    disableProgressSpinner: true,
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',    
});
PostsListController = RouteController.extend({
    template: 'postsList',
    increment: 5,
    limit: function() {
        return parseInt(this.params.postsLimit) || this.increment;
    },
    findOptions: function() {
        return {sort: this.sort, limit: this.limit()};        
    },
    waitOn: function() {
        return [
            Meteor.subscribe('posts', this.findOptions()),
            Meteor.subscribe('links')      
        ];
    },
    data: function() {
        return {
            posts: Posts.find({}, this.findOptions()),
            nextPath: this.nextPath()
        };        
    }
});

NewPostsListController = PostsListController.extend({
    sort: {submitted: -1, _id: -1}, 
    nextPath: function() {
        return Router.routes.newPosts.path({postsLimit: this.limit() 
            + this.increment})
    }
});
BestPostsListController = PostsListController.extend({
    sort: {votes: -1, submitted: -1, _id: -1},
    nextPath: function() {
        return Router.routes.bestPosts.path({postsLimit: this.limit() 
            + this.increment})
    }
});

EditResController = RouteController.extend({
    template: 'postEdit',
    waitOn: function() {
        return [
            Meteor.subscribe('singlePost', this.params._id),
            Meteor.subscribe('features')
        ]
    },    
    data: function() { 
        return {
            user: Meteor.user().username,
            title: this.title,
            resource: Posts.findOne(this.params._id),
            bookmark: this.bookmark,
            remove: this.remove
         };
    }
});

EditPostController = EditResController.extend({
    title: "Edit Post",
    bookmark: false,
    remove: true
});

SaveBookmarkController = EditResController.extend({
    title: "Save Bookmark",
    bookmark: true,
    remove: false
});


Router.map(function() {
    this.route('home', {
        path: '/',
        controller: NewPostsListController
    });
    this.route('newPosts', {
        path: '/new/:postsLimit?',
        controller: NewPostsListController
    });
    this.route('bestPosts', {
        path: '/best/:postsLimit?',
        controller: BestPostsListController
    });    
    this.route('postPage', {
        path: '/posts/:_id',
        waitOn: function(){
            return Meteor.subscribe('singlePost', this.params._id);
        },
        data: function() { return Posts.findOne(this.params._id);}
    });
    this.route('postEdit', {
        path: 'posts/:_id/edit',
        controller: EditPostController
        // waitOn: function() {
        //     return [
        //         Meteor.subscribe('singlePost', this.params._id),
        //         Meteor.subscribe('features')
        //     ]
        // },
        // data: function() { return Posts.findOne(this.params._id);}
    });
    this.route('saveBookmark', {
        path: '/user/:user/save_bookmark/:_id',
        controller: SaveBookmarkController
    });
    this.route('postSubmit', {
        path: '/submit',
        waitOn: function() {
            return Meteor.subscribe('features');
        },        
        disableProgress: true
    });
});
var requireLogin = function() {
    if (! Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render('this.loadingTemplate');    
        }
        else {
            this.render('accessDenied');
        }        
        this.stop();
    }
}
Router.before(requireLogin, {only: 'postSubmit'});
Router.before(function() {clearErrors()});
