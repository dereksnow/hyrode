Template.header.helpers({
  activeRouteClass: function (/* route names */) {
    var args, active;

    args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    active = _.any(args, function(name){
      return Router.current().route.name === name
    });

    return active && 'active';
  }
});