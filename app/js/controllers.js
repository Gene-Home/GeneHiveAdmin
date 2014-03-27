'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', [function() {

  }]);

var geneHiveControllers = angular.module('geneHiveControllers', []);
 
geneHiveControllers.controller('JobRunListCtrl', ['$scope','$http', 'JobRun', function($scope,$http, JobRun) {
  /*
  $scope.jobRuns = JobRun.query().$promise.then(
   function(jobRuns){
   	$scope.jobRuns = jobRuns;
  	}
  )
*/
	
   $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    }; 
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [250, 500, 1000],
        pageSize: 250,
        currentPage: 1
    };	
    $scope.setPagingData = function(data, page, pageSize){	
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('/GeneHive/api/v2/JobRuns/').success(function (largeLoad) {		
                    data = largeLoad.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                });            
            } else {
                $http.get('/GeneHive/api/v2/JobRuns/').success(function (largeLoad) {
                    $scope.setPagingData(largeLoad,page,pageSize);
                     
                });
            }
        }, 100);
    };
	
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
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


}]);
geneHiveControllers.controller('JobRunDetailsCtrl', ['$scope', '$routeParams',
  function($scope, $routeParams) {
    $scope.jobRunId = $routeParams.jobRunId;
  }]);
 

 geneHiveControllers.controller('JobRunDetailsCtrl', ['$scope', '$routeParams', 'JobRun', 
 	              function($scope, $routeParams, JobRun) {
  	$scope.jobRun = JobRun.get({jobRunId: $routeParams.jobRunId});
  }]);