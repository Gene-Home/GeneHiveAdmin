
/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');

var geneHiveServices = angular.module('geneHiveServices', ['ngResource']);
 
geneHiveServices.factory('JobRun', ['$resource',
  function($resource){
    return $resource('/GeneHive/api/v2/JobRuns/:jobRunId', {}, {
      query: {method:'GET', isArray:true}
    });
  }]
 );