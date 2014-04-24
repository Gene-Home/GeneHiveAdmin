
/* Services */

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
      query: {method:'GET', isArray:true},
      create: {method:'POST'}
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
// Idea .. can we deep load in the service ???
geneHiveServices.factory('JobType', ['$resource',
  function($resource){
    return $resource('/GeneHive/api/v2/JobTypeProperties/:jobTypeName', {}, {
      query: {method:'GET', isArray:true}
    });
  }]
 );

geneHiveServices.service('GridService',['$q',
	function($q){
	this.initGrid = function initGrid($scope,$sortService,queryableService,
		  selectedItemArray,columnDefs)
{
    var deferred = $q.defer();

    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [250, 500, 1000],
        pageSize: 250,
        currentPage: 1
    };	
    $scope.sortInfo = { fields: [], columns: [], directions: [] }
    $scope.setPagingData = function(page, pageSize){
  	 if($scope.cachedServerData==null){
	     return;
	   }
	   var page = $scope.pagingOptions.currentPage;
	   var pageSize = $scope.pagingOptions.pageSize;
	   $sortService.Sort($scope.sortInfo,$scope.cachedServerData);
      var pagedData = $scope.cachedServerData.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = $scope.cachedServerData.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };// end setPagingData
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        $scope.setPagingData();
    }, true);
    $scope.$watch('sortInfo', function(newVal, oldVal) {
	$scope.setPagingData();
    }, true);
    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
		showFooter: true,
	    useExternalSorting: true,
        totalServerItems: 'totalServerItems',
	    sortInfo: $scope.sortInfo,
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs: columnDefs,
        multiSelect: false,
        selectedItems: selectedItemArray
    };
    $scope.cachedServerData = null;
    $scope.refreshData=function() {
      $scope.cachedServerData = null;
      if (!$scope.$$phase) {
            $scope.$apply();
      }
	   var freshData=queryableService.query(function () {
	      $scope.cachedServerData = freshData;
	      $scope.setPagingData();
         deferred.resolve('Hello, !');
	   })
  }
  $scope.refreshData();    
  return deferred.promise;
}// end init grid		


}
])