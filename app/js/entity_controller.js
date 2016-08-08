var entitiesController = angular.module('geneHive.EntitiesController', []);

entitiesController.controller('EntitiesCtrl', ['$scope','$http', 'Entity','uiGridConstants',
	function($scope,$http,Entity,uiGridConstants) {

	// the currently selected entities in the display grid
	$scope.selectedEntities = [];
	var columnDefs=[
		{field:"name", displayName:'Name'},
		{field:"class", displayName:'Class'}
	];

	$scope.gridOptions = {
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            columnDefs: columnDefs,
            enableFullRowSelection: true,
            multiSelect: false,
            noUnselect: true,
            selectedItems: $scope.selectedEnts
        };
    ;
         $scope.gridOptions.onRegisterApi = function( gridApi ) {
            $scope.gridApi = gridApi;
            //$scope.gridApi.grid.registerRowsProcessor( $scope.singleFilter, 200 );
            $scope.loadEntities();
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                var msg = 'row selected ' + row.isSelected;
                 $scope.selectedEnt = row.entity;
                
            });
            //needs to be called to have rows selectable
            $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.OPTIONS);
    };    
	$scope.loadEntities = function(){
		Entity.query().$promise.then(
            function(ents){
                $scope.entities = ents;
                $scope.gridOptions = ents;
            }
      	  )
    	};
	
	//GridService.initGrid($scope,$sortService,Entity,$scope.selectedEntities,columnDefs).then($scope.loadEntities);	




}]);