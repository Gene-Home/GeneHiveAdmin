'use strict';


// Declare app level module which depends on filters, and services
/**
angular.module('geneHiveAdmin', [
  'ngRoute',
  'ui.bootstrap',
  'ngGrid',
  'geneHiveControllers',
  'geneHive.JobRunsController',
  'geneHive.JobTypesController',
  'geneHive.UsersController',
  'geneHive.WorkFilesController',
  'geneHiveServices'
]).
config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/jobTypes', {templateUrl: 'partials/jobTypes.html',controller: 'JobTypesCtrl'});
  $routeProvider.when('/jobRuns', {templateUrl: 'partials/jobRun.html',controller: 'JobRunsCtrl'});
	$routeProvider.when('/users', {templateUrl: 'partials/users.html', controller: 'UsersCtrl'});
  $routeProvider.when('/workFiles', {templateUrl: 'partials/workFiles.html', controller: 'WorkFilesCtrl'});
  $routeProvider.when('/sysConf', {templateUrl: 'partials/systemConf.html', controller: 'SysConfCtrl'});
  $routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard.html'})

  $routeProvider.otherwise({redirectTo: '/dashboard'});
}]);
*/
angular.module('geneHiveAdmin', [
  'ngRoute',
  'ui.router',
  'ui.bootstrap',
  'ui.grid',
  'ui.grid.edit',
  'ui.grid.selection',
  'ui.select', 'ngSanitize',
  'geneHiveControllers',
  'geneHive.JobRunsController',
  'geneHive.JobTypesController',
  'geneHive.UsersController',
  'geneHive.WorkFilesController',
  'geneHive.EntityClassesController',
  'geneHive.EntitiesController',
  'geneHive.StorageController',
  'geneHiveServices'
]).
config(['$stateProvider', function ($stateProvider) {
  $stateProvider
    .state('index', { url: "", templateUrl:'partials/dashboard.html'})
    .state('jobTypes',{url:'/jobTypes',templateUrl: 'partials/jobTypes.html',controller:'JobTypesCtrl'})
    .state('jobRuns',{url:'/jobRuns',templateUrl: 'partials/jobRun.html',controller:'JobRunsCtrl'})
    .state('users',{url:'/users',templateUrl: 'partials/userMain.html',controller:'UsersCtrl'})
    .state('workFiles',{url:'/workFiles',templateUrl: 'partials/workFiles.html',controller:'WorkFilesCtrl'})
    .state('entityClasses',{url:'/entityClasses',templateUrl: 'partials/entityClasses.html',controller:'EntityClassesCtrl'})
    .state('entities',{url:'/entities',templateUrl: 'partials/entities.html',controller:'EntitiesCtrl'})
    .state('sysConf',{url:'/sysConf',templateUrl: 'partials/systemConf.html',controller:'SysConfCtrl'})
    .state('storageConf',{url:"/storageConf",templateUrl:'partials/storageConfMain.html',controller:'StorageConfCtrl'})
    
}])
         