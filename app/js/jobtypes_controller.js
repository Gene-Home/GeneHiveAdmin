var jobTypesController = angular.module('geneHive.JobTypesController', []);


jobTypesController.controller('JobTypesCtrl', ['$scope','$http','$uibModal', 'JobType','uiGridConstants',
					 function($scope,$http,$uibModal,JobType,uiGridConstants) {

 $scope.selectedJobTypes = [];
 $scope.selectedJobType = {};
 $scope.jobTypeScript = "";
 $scope.filterOptions = {
      filterText: ''
    };
 $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
    if( col.filters[0].term ){
      return 'header-filtered';
    } else {
      return '';
    }
  };   
 var columnDefs= [
     {field:'name', headerCellClass: $scope.highlightFilteredHeader},
        {field:"creator",enableFiltering: false},
        {field:'trashed',enableFiltering: false},
        {field:'public',enableFiltering: false}
    ];
 $scope.gridOptions = {
        enableFiltering: true,
        enableSorting: true,
        enableRowSelection: true,
        columnDefs: columnDefs,
        enableFullRowSelection: true,
        multiSelect: false,
        noUnselect: true,
        selectedItems: $scope.selectedJobType
    
    };
 $scope.gridOptions.onRegisterApi = function( gridApi ) {
            $scope.gridApi = gridApi;
            //$scope.gridApi.grid.registerRowsProcessor( $scope.singleFilter, 200 );
            $scope.loadJobTypes();
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                var msg = 'row selected ' + row.isSelected;
                 $scope.selectedJobType = row.entity;
                 //$scope.showJSON($scope.selectedJobType);
                //$scope.selectedUser = row.entity;
                //$scope.clearMessages();  
                // TODO these should be chained
                //loadWorkFiles($scope.selectedUser.username);
                //load the new ones
                //loadJobRuns($scope.selectedUser.username);
                
            });
            //needs to be called to have rows selectable
            $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.OPTIONS);
    };
$scope.loadJobTypes = function(){
    JobType.query(function(jobTypes){
        $scope.gridOptions.data = jobTypes;
    })
}      

 var getScript = function(jobTypeName){
     $http({method: 'GET', url: '/GeneHive/api/v2/Groups' + jobTypeName}).
        success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.jobTypeScript = data;
        }).
        error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert('not found')
        });

};
$scope.showJSON = function (jobTypeDef) {
        var modalInstance = $uibModal.open({
            templateUrl: 'partials/jobTypesModal.html',
            controller: 'JobTypesModalController',
            resolve: {
                jobTypeDef: function() {return jobTypeDef}
            }
        });
        modalInstance.result.then(function (response) {
           // $scope.loadWorkFiles();
            console.log(response);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    //GridService.initGrid($scope, $sortService, JobType, $scope.selectedJobTypes, columnDefs);

    $scope.$watch('selectedJobTypes', function(newValue, oldValue){
    // only make the call if selectedJobTypes has a length of at least 1
    if ($scope.selectedJobTypes.length ) {
        $scope.showJSON($scope.selectedJobTypes[0]);
        //getScript(newValue[0].name)
    }   
    },true);

}])// end jobTypesController

/*
* Controller for the job type modal
*/
jobTypesController.controller('JobTypesModalController', function modalController ($scope, $uibModalInstance,jobTypeDef) {

    $scope.jobTypeDef = jobTypeDef;
    var x = 45;
    $scope.ok = function () {
        $uibModalInstance.close();
        console.log('ok');
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        console.log('cancel');
    };
});