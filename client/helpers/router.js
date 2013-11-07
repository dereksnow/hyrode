Meteor.Router.add({
	'/': {to: 'newPosts', as: 'home'},
	'/best': 'bestPosts',
	'/new': 'newPosts',
	'/posts/:_id': {
		to: 'postPage',
		and: function(id) {Session.set('currentPostId', id);}
	},
	'/posts/:_id/edit': {
		to: 'postEdit',
		and: function(id) {Session.set('currentPostId', id);}
	},
	'/submit': 'postSubmit'
});
Meteor.Router.filters({
	'requiredLogin': function(page) {
		if(Meteor.user()){
			return page;
		}
		else if (Meteor.loggingIn()) {
			return 'loading';
		}
		else {
			return 'accessDenied';
		}
			
	},
	'clearErrors': function(page) {
		clearErrors();
		return page;
	}
});
Meteor.Router.filter('requiredLogin', {only: 'postSubmit'});
Meteor.Router.filter('clearErrors');