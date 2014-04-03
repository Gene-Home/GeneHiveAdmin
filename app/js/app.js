'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ngGrid',
  'geneHiveControllers',
  'geneHive.UsersController',
  'geneHiveServices'
]).
config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/jobRuns', {templateUrl: 'partials/jobRuns.html'});
	$routeProvider.when('/users', {templateUrl: 'partials/users.html', controller: 'UsersCtrl'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
