'use strict';

/* Controllers */

angular.module('myApp.controllers', []);

var geneHiveControllers = angular.module('geneHiveControllers', []); 
geneHiveControllers.controller('JobRunListCtrl', ['$scope','$http','$sortService', function($scope,$http,$sortService) {
    $scope.cachedServerData = null;
    $scope.refreshData=function() {
	$scope.cachedServerData = null;
       if (!$scope.$$phase) {
            $scope.$apply();
        }
	$http.get('/GeneHive/api/v2/JobRuns/').success(function (data) {
	    $scope.cachedServerData = data;
	    $scope.setPagingData();
	})};
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [250, 500, 1000],
        pageSize: 250,
        currentPage: 1
    };	
    $scope.sortInfo = { fields: [], columns: [], directions: [] }
    $scope.setPagingData = function(page, pageSize){
	if($scope.cachedServerData==null)
	{
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
    };
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        $scope.setPagingData();
    }, true);
    $scope.$watch('sortInfo', function(newVal, oldVal) {
	console.log("sortInfo watch fired");
	$scope.setPagingData();
    }, true);
    $scope.$on('ngGridEventSorted', function(newSort) {
	console.log("grid sort event fired");
    });

$scope.selectedJobRun = [];	
    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
		showFooter: true,
	useExternalSorting: true,
        totalServerItems: 'totalServerItems',
	sortInfo: $scope.sortInfo,
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs: [{field:'id', displayName:'ID',width: 30},
        {field:"inputs.name[0]", displayName:'Name'},
        			  {field:'creator', displayName:'Creator'},
        			  {field:'jobType', displayName:'Job Type'},
                     {field:'runDatetime',displayName:'Run Date'}, 
                     {field:'status',displayName:'Status',cellTemplate: '<div ng-class="{green: row.getProperty(col.field) ==\'COMPLETE\'}"><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>'}],
        multiSelect: false,
        selectedItems: $scope.selectedJobRun
    };
    $scope.refreshData();    
}]);

geneHiveControllers.controller('JobRunDetailsCtrl', ['$scope', '$routeParams',
  function($scope, $routeParams) {
    $scope.jobRunId = $routeParams.jobRunId;
  }]);
