var workFilesController = angular.module('geneHive.WorkFilesController', []);


workFilesController.controller('WorkFilesCtrl', ['$scope','$http', 'WorkFile','uiGridConstants',
					 function($scope,$http,WorkFile,uiGridConstants) {

 $scope.selectedWorkFiles	= [];
 $scope.filterOptions = {
      filterText: ''
    };
 var columnDefs= [
     {field:'id',width: 60},
        {field:"creator"},
        {field: "group"},
        {field: 'storage'},
        {field: "creationDatetime"},
        {field:'originalName'},
        {field:'fileType'},
        {field:'length',width: 80},
        {field:'isTrashed',width: 80},
    ];
     $scope.gridOptions = {
        enableFiltering: true,
        enableSorting: true,
        enableRowSelection: true,
        columnDefs: columnDefs,
        enableFullRowSelection: true,
        multiSelect: false,
        noUnselect: true,
        selectedItems: $scope.selectedJobRuns
    
    };
    var loadWorkFiles = function(){
        WorkFile.query(function(wfiles){
            $scope.gridOptions.data = wfiles;
        })
    };
    $scope.selectedWorkFile = {};
    $scope.gridOptions.onRegisterApi = function( gridApi ) {
            $scope.gridApi = gridApi;
            //$scope.gridApi.grid.registerRowsProcessor( $scope.singleFilter, 200 );
            loadWorkFiles();
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                var msg = 'row selected ' + row.isSelected;
                $scope.selectedWorkFile = row.entity;
                $scope.downloadLink = '/hive/v2/WorkFileContents/' + 
                    $scope.selectedWorkFile.id + "/" +
                    $scope.selectedWorkFile.originalName
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
    //GridService.initGrid($scope, $sortService, WorkFile, $scope.selectedWorkFiles, columnDefs);

}])