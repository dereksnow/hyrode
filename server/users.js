// Add user fields during intialization of user accounts
Accounts.onCreateUser(function(options, user) {
  user.pages_saved = [];
  user.paths_saved = [];
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;
  return user;
});