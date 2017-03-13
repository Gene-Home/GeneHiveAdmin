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
  
  'ui.router',
  'ui.bootstrap',
  'ui.grid',
  'ui.grid.edit',
  'ui.grid.selection',
  'ui.grid.pagination',
  'ui.select', 
  'ngSanitize',
  'ngCookies',
  'ngFileUpload',
  'base64',
  'geneHiveControllers',
  'geneHive.JobRunsController',
  'geneHive.JobTypesController',
  'geneHive.UsersController',
  'geneHive.WorkFilesController',
  'geneHive.EntityClassesController',
  'geneHive.EntitiesController',
  'geneHive.StorageController',
  'geneHive.SysConfControllers',
  'geneHive.LoginController',
  'geneHiveServices',
  'geneHiveServices2'
]).
config(['$stateProvider', function ($stateProvider) {
  $stateProvider
    .state('index', { url: "", visibility: 'private',templateUrl:'partials/dashboard.html'})
    .state('login',{url: "/login",visibility: 'public',templateUrl: 'partials/login.html',controller: 'LoginCtrl',data:{logging_in:true}})
    .state('logout',{url: "/logout",visibility: 'private',templateUrl: 'partials/logout.html',controller: 'LoginCtrl',data:{logging_in:false}})
    .state('jobTypes',{url:'/jobTypes',visibility: 'private',templateUrl: 'partials/jobTypes.html',controller:'JobTypesCtrl'})
    .state('jobRuns',{url:'/jobRuns',visibility: 'private',templateUrl: 'partials/jobRun.html',controller:'JobRunsCtrl'})
    .state('users',{url:'/users',visibility: 'private',templateUrl: 'partials/userMain.html',controller:'UsersCtrl'})
    .state('workFiles',{url:'/workFiles',visibility: 'private',templateUrl: 'partials/workFilesMain.html',controller:'WorkFilesCtrl'})
    .state('entityClasses',{url:'/entityClasses',visibility: 'private',templateUrl: 'partials/entityClassMain.html',controller:'EntityClassesCtrl'})
    .state('entities1',{url:'/entities',visibility: 'private',templateUrl: 'partials/entities.html',controller:'EntitiesCtrl'})
    .state('emailConf',{url:'/emailConf',visibility: 'private',templateUrl: 'partials/emailConf.html',controller:'SysConfCtrl'})
    .state('loginConf',{url:'/loginConf',visibility: 'private',templateUrl: 'partials/loginConf.html',controller:'SysConfCtrl'})
    .state('executionConf',{url:"/executionConf",visibility: 'private',templateUrl:'partials/executionConfMain.html',controller:'executionConfCtrl'})
    .state('storageConf',{url:"/storageConf",visibility: 'private',templateUrl:'partials/storageConfMain.html',controller:'StorageConfCtrl'})
    .state('entities',{url:"/entities",visibility: 'private',templateUrl:'partials/entities.html',controller:'EntitySearchCtrl'})
    .state('entities.search',{url:"/entitySearch",visibility: 'private',templateUrl:'partials/entitySearch.html',controller:'EntitySearchCtrl'})
    .state('entities.editWorkFile',{url:"/editWorkFile",visibility: 'private',templateUrl:'partials/workFileEdit.html',controller:'EntitySearchCtrl',params: {workFile: null}})
    
}]).
config(['$httpProvider', function ($httpProvider){
    $httpProvider.defaults.withCredentials = true;
}]).
run(['AuthService','$rootScope','$state',function(AuthService,$rootScope,$state) {
    $rootScope.debug = false;
    if (AuthService.cookieLogin()){
      // do nothing - let the guy thru
    }else{
      // set something in the root scope saying that
      // we saw someone and passed him to index
      if($rootScope.visited == undefined){
        $rootScope.visited = true;
        location = "#/login"
      }
     // punted for the moment .. we need an auth system for each url
    }
    
    $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
            // redirect to login page if not logged in and trying to access a restricted page
            //var restrictedPage = ($location.path() =='#/login', '#/register']) === -1;
            var loggedIn = $rootScope.currentUser;
            if(toState.visibility == 'private' && !loggedIn){
              e.preventDefault()  
              $state.go('login')
            }
        });
    return false;
}]);
         