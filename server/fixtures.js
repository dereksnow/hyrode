if (Posts.find().count() === 0) {
  Posts.insert({
    title: 'Introducing Telescope',
    author: 'Sacha Greif',
    url: 'http://sachagreif.com/introducing-telescope/'
  });

  Posts.insert({
    title: 'Meteor',
    author: 'Tom Coleman',
    url: 'http://meteor.com'
  });

  Posts.insert({
    title: 'The Meteor Book',
    author: 'Tom Coleman',
    url: 'http://themeteorbook.com'
  });
}

if (Features.find().count() === 0) {
  Features.insert({
    name: 'Certificates',
    icon: 'fa-certificate'
  });

  Features.insert({
    name: 'Feedback',
    icon: 'fa-exchange'
  });

  Features.insert({
    name: 'Sandbox',
    icon: 'fa-flask'
  });
  
  Features.insert({
    name: 'Video',
    icon: 'fa-film'
  });  
} 