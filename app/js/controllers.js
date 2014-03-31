'use strict';


function initGrid($scope,$sortService,queryableService,
		  selectedItemArray,columnDefs)
{
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
	})
    }
    $scope.refreshData();    

}

/* Controllers */

angular.module('myApp.controllers', []);

var geneHiveControllers = angular.module('geneHiveControllers', []); 
geneHiveControllers.controller('JobRunListCtrl', ['JobRun', '$scope','$http','$sortService', function(JobRun,$scope,$http,$sortService) {
    $scope.selectedJobRun = [];	
    var dateSort=function(x,y) {
	var dx=Date.parse(x)
	var dy=Date.parse(y)
	if(dx<dy) return -1;
	if(dy<dx) return 1;
	return 0;
    };
    var columnDefs=[
	{field:'id', displayName:'ID',width: 30},
        {field:"inputs.name[0]", displayName:'Name'},
        {field:'creator', displayName:'Creator'},
        {field:'jobType', displayName:'Job Type'},
        {field:'runDatetime',displayName:'Run Date', sortFn: dateSort },
        {field:'status',displayName:'Status',cellTemplate: '<div ng-class="{green: row.getProperty(col.field) ==\'COMPLETE\'}"><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>'}
    ];
    initGrid($scope, $sortService, JobRun, $scope.selectedJobRun, columnDefs);

}]);

geneHiveControllers.controller('JobRunDetailsCtrl', ['$scope', '$routeParams',
  function($scope, $routeParams) {
    $scope.jobRunId = $routeParams.jobRunId;
  }]);
