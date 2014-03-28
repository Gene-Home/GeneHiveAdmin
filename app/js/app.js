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
  'geneHiveServices'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/jobRuns', {templateUrl: 'partials/jobRuns.html'});
  $routeProvider.when('/jobRuns/:jobRunId', {templateUrl: 'partials/jobRunDetails.html', controller: 'JobRunDetailsCtrl'});	
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
