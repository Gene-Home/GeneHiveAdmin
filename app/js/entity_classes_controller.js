var entityClassesController = angular.module('geneHive.EntityClassesController', []);

entityClassesController.controller('EntityClassesCtrl',['$scope','$http','$uibModal','uiGridConstants','EntityClass',
	function($scope,$http,$uibModal,uiGridConstants,EntityClass) {
         // default to the listing view
    $scope.subview = 'list';
    $scope.getInclude = function(){
      if ($scope.subview == 'list'){
          return 'partials/entityClassList.html'
      }else if($scope.subview =='edit'){
        return 'partials/entityClassEdit.html'
      }else if($scope.subview =='view'){
        return 'partials/entityClassView.html'
      }
    }
		$scope.selectedEntityClasses = [];
        var viewButton = '<div class="ui-grid-cell-contents">' +
                         '  <button type="button"' +
                         '           class="btn btn-xs btn-primary"' +
                         ' ng-click="grid.appScope.viewEntityClass(grid, row)"' +
                         ' >View Me Asshole' +
                         '</button>' +
                         '  <button type="button"' +
                         '           class="btn btn-xs btn-primary"' +
                         ' ng-click="grid.appScope.editEntityClass(grid, row)"' +
                         ' >Edit Me' +
                         '</button></div>'
		var columnDefs=[
            {field:"name", displayName:'Name'},
            {field:"group"},
            {field:'id', name: '', cellTemplate: viewButton, width: 254 },
        ];

        $scope.gridOptions = {
            enableFiltering: false,
            enableSorting: true,
            enableRowSelection: false,
            columnDefs: columnDefs,
            enableFullRowSelection: true,
            multiSelect: false,
            noUnselect: true,
            selectedItems: $scope.selectedJobRuns
        };
        $scope.newVariable = {};

		$scope.listEntityClasses = function(){
        EntityClass.query().$promise.then(
            function(eclasses){
                $scope.entityClasses = []
                for (i = 0; i<eclasses.length; i++){
                    eclasses[i].idx = i;
                    $scope.entityClasses.push(eclasses[i]);
                }
                $scope.subview='list';
            }
      	  )
    	};
        $scope.refreshEntityClasses = function(){
        EntityClass.query().$promise.then(
            function(eclasses){
                $scope.entityClasses = []
                for (i = 0; i<eclasses.length; i++){
                    eclasses[i].idx = i;
                    $scope.entityClasses.push(eclasses[i]);
                }
            }
          )
        };
        
        $scope.viewEntityClass = function(idx){
            $scope.action = 'viewing';
            $scope.selectedEC = $scope.entityClasses[idx];
            $scope.subview = 'view';

        }
        $scope.addEntityClass = function(){
            $scope.newLoc = {};
            $scope.successMessage = undefined;
            $scope.errorMessage = undefined;
            $scope.action = 'creating';
            $scope.subview = 'edit';
            $scope.selectedEC = {}
        };
        $scope.editEntityClass = function(idx){
            $scope.action = 'udating';
            $scope.selectedEC = $scope.entityClasses[idx];
            $scope.subview = 'edit';

        }
        $scope.removeVariable = function(varName){
            delete $scope.selectedEC.variables[varName];
        };
        $scope.addVariable = function(){
            var newName = $scope.newVariable.name
            // there could be no variables in the class
            // so need to add if null
            if($scope.selectedEC.variables == null ){
                $scope.selectedEC.variables = {};
            } 
            $scope.selectedEC.variables[newName] = $scope.newVariable;
            $scope.newVariable = {};
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
        $scope.updateClass = function(isValid){
            $scope.submitted = true;
            if(!isValid){
                return;
            }
            //BEFOre the UPDATE WE SHOULD MAp thE REMOVED FIELDS to Null or set 
            //should be as easy and iterating over the fields from existing and see if they are in the 
            //new one - shit .. means we have to keep the old one .. right now we just change it ... 
            // hmmm gott think
            // HA --- its javascript .. just check for a dynamically added filed called .. remove me
            // this implies that we need to adjust the GUI
            // for (fields in )
            EntityClass.update({'entityClassName':$scope.selectedEC.name},$scope.selectedEC).$promise.then(
                function(entityClass){
                    $scope.errorMessage = null;
                    $scope.successMessage = "Successfully Updated Class: " + entityClass.name;
                    $scope.newClass = angular.copy(entityClass,$scope.selectedEC)
                    $scope.createSuccess = true;
                },
                function(message){
                    $scope.errorMessage = "Error Updating Class: " + message.data;
                }
            )
        }//end updateClass
        $scope.createClass = function(isValid){
            $scope.submitted = true;
            if(!isValid){
                return;
            }
            EntityClass.create({},$scope.selectedEC).$promise.then(
                function(entityClass){
                    $scope.errorMessage = null;
                    $scope.successMessage = "Successfully Created Class: " + entityClass.name;
                    $scope.selectedEC = angular.copy(entityClass,$scope.selectedEC)
                    $scope.createSuccess = true;
                },
                function(message){
                    $scope.errorMessage = "Error Creating Class: " + message.data;
                }
            )
        }; //end createClass
        $scope.listEntityClasses()
    }
]);
