'use strict';


// Declare app level module which depends on filters, and services
angular.module('geneHiveAdmin', [
  'ngRoute',
  'ui.bootstrap',
  'ngGrid',
  'geneHiveControllers',
  'geneHive.JobRunsController',
  'geneHive.UsersController',
  'geneHive.WorkFilesController',
  'geneHiveServices'
]).
config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/jobRuns', {templateUrl: 'partials/jobRuns.html',controller: 'JobRunsCtrl'});
	$routeProvider.when('/users', {templateUrl: 'partials/users.html', controller: 'UsersCtrl'});
  $routeProvider.when('/workFiles', {templateUrl: 'partials/workFiles.html', controller: 'WorkFilesCtrl'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
