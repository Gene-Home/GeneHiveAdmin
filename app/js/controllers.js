'use strict';

/* Controllers */

angular.module('myApp.controllers', []);

var geneHiveControllers = angular.module('geneHiveControllers', []); 
geneHiveControllers.controller('JobRunListCtrl', ['$scope','$http', function($scope,$http) {
    $scope.cachedServerData = null;
    $scope.refreshData=function() {
	$scope.cachedServerData = null;
       if (!$scope.$$phase) {
            $scope.$apply();
        }
	$http.get('/GeneHive/api/v2/JobRuns/').success(function (data) {
	    $scope.cachedServerData = data;
	    $scope.setPagingData($scope.pagingOptions.currentPage,$scope.pagingOptions.pageSize);
	})};
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [250, 500, 1000],
        pageSize: 250,
        currentPage: 1
    };	
    $scope.setPagingData = function(page, pageSize){	
        var pagedData = $scope.cachedServerData.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.setPagingData($scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
        }
    }, true);

$scope.selectedJobRun = [];	
    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
		showFooter: true,
        totalServerItems: 'totalServerItems',
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
