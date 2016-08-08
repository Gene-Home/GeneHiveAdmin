var entityClassesController = angular.module('geneHive.EntityClassesController', []);

entityClassesController.controller('EntityClassesCtrl',['$scope','$http','$modal','uiGridConstants','EntityClass',
	function($scope,$http,$modal,uiGridConstants,EntityClass) {

		$scope.selectedEntityClasses = [];
		var columnDefs=[
            {field:"name", displayName:'Name'},
            {field:"group"},
            {field:"owner"},
            {field:"permissions"}
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

		$scope.loadClasses = function(){
        EntityClass.query().$promise.then(
            function(eclasses){
                $scope.entityClasses = eclasses;
                $scope.gridOptions.data = eclasses;
            }
      	  )
    	};
         $scope.gridOptions.onRegisterApi = function( gridApi ) {
            $scope.gridApi = gridApi;
            //$scope.gridApi.grid.registerRowsProcessor( $scope.singleFilter, 200 );
            $scope.loadClasses();
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                var msg = 'row selected ' + row.isSelected;
                 $scope.selectedEC = row.entity;
                
            });
            //needs to be called to have rows selectable
            $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.OPTIONS);
    };
    	//GridService.initGrid($scope, $sortService, EntityClass,$scope.selectedEntityClasses,columnDefs).then($scope.loadClasses);
        
    	$scope.editClass = function (modalName) {
        	var modalInstance = $modal.open({
            	templateUrl: 'partials/newClassModal.html',
            	controller: 'ClassModalController',
            	resolve: {
                	entityClasses: function(){
                    	return $scope.entityClasses;
                	},
                    entityClass: function(){
                        return $scope.selectedEC;
                    },
                    isCreating: function(){
                        return false;
                    }
            	}
			})
		};// end createClass
        $scope.createClass = function (modalName) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/newClassModal.html',
                controller: 'ClassModalController',
                resolve: {
                    entityClasses: function(){
                        return $scope.entityClasses;
                    },
                    entityClass: function(){
                        return {};
                    },
                    isCreating: function(){
                        return true;
                    }
                }
            })
        };// end createClass

	}//end function
]);
