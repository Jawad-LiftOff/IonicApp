angular.module('dials.services', ['ngResource'])  

.factory('DataManager', function ($resource) {
  
  var url = "http://private-fd322-oddball.apiary-mock.com";
  var service = $resource(url + "/:action/",
    { action: '@action', id: '@id'},
    {
      'events': {method: 'GET', isArray: true, params: {action: 'events'}},
      'schedule': {method: 'GET', isArray: true, params: {action: 'schedule'}}
    });

  return service;
});