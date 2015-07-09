angular.module('dials.services', ['ngResource'])  

.factory('EventsManager', function ($resource) {

  // REST-API for the user is invoked from here
  var service = $resource("data/:action/",
    { action: '@action', id: '@id'},
    {
      'events': {method: 'GET', isArray: true, params: {action: 'events.json'}}
    });

  return service;
});