
/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');

var geneHiveServices = angular.module('geneHiveServices', ['ngResource']);

geneHiveServices.factory('WorkFile',['$resource',
  function($resource){
    return $resource('/GeneHive/api/v2/WorkFileProperties/', {}, {
      query: {method:'GET', isArray:true}
    });
  }]
 );

geneHiveServices.factory('UserGroup',['$resource',
  function($resource){
    return $resource('/GeneHive/api/v2/Groups/', {}, {
      query: {method:'GET', isArray:true}
    });
  }]
 );

geneHiveServices.factory('User',['$resource',
  function($resource){
    return $resource('/GeneHive/api/v2/Users/:uname', {}, {
      query: {method:'GET', isArray:true},
      update: {method:'PUT'},
      create: {method:'POST'}
    });
  }]
 );
 
geneHiveServices.factory('JobRun', ['$resource',
  function($resource){
    return $resource('/GeneHive/api/v2/JobRuns/:jobRunId', {}, {
      query: {method:'GET', isArray:true}
    });
  }]
 );