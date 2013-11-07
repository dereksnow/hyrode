Template.header.helpers({
  activeRouteClass: function (/* route names */) {
    var args, active;

    args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    active = _.any(args, function(name){
      return location.pathname === Meteor.Router[name + 'Path']();
    });

    return active && 'active';
  }
});