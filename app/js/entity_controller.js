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
    $scope.createEntity = function (modalName) {
        var modalInstance = $uibModal.open({
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
    };// end createEntity    
	$scope.loadEntities = function(){
		Entity.query().$promise.then(
            function(ents){
                $scope.entities = ents;
                $scope.gridOptions.data = ents;
            }
      	  )
    	};
	
	//GridService.initGrid($scope,$sortService,Entity,$scope.selectedEntities,columnDefs).then($scope.loadEntities);	

}]);

entitiesController.controller('EntitySearchCtrl',['$scope','$http','$state','$stateParams','Entity','EntityClass','uiGridConstants','WorkFile',
    function($scope,$http,$state,$stateParams,Entity,EntityClass,uiGridConstants,WorkFile) {

        $scope.platforms = [];
        $scope.samples = [];
        $scope.platform = {};
        // in case we want to edit one
        $scope.workFile = $stateParams.workFile;
        $scope.search = {
            searchFor:"Please Select",
            workFilesOnly:false,
        };
        $scope.fullTextValue="";
        $scope.totalEntityCount = 0;
        
       
        $scope.selectedEntities = [];

        var wfButton = '<div class="ui-grid-cell-contents">' +
                         '  <button type="button"' +
                         '           class="btn btn-xs btn-primary"' +
                         ' ng-click="grid.appScope.editWorkFile(COL_FIELD)"' +
                         ' >Edit WorkFile' +
                         '</button>' +
                        ' </div>';

        var entButton = '<div class="ui-grid-cell-contents">' +
                         '  <button type="button"' +
                         '           class="btn btn-xs btn-primary"' +
                         ' ng-click="grid.appScope.editEntity(row)"' +
                         ' >Edit WorkFile' +
                         '</button>' +
                        ' </div>';                
        $scope.columnDefs=[
        {field:"id",diplayName:"Edit"},
        {field:"name", displayName:'Name'},
        {field:"class", displayName:'Class'},
        {field:"owner",displayName:'Owner'},
        {field:"filenames",displayName:"Files"},
        {field:"creationDate",displayName:"Created"}

        ];
        $scope.gridOptions = {
            enableFiltering: false,
            enableSorting: false,
            enableRowSelection: true,
            columnDefs: $scope.columnDefs,
            enableFullRowSelection: true,
            multiSelect: false,
            noUnselect: true
        };
      
        var makeEntityEditButton = function(entityId){
            return '<div class="ui-grid-cell-contents">' +
                         '  <button type="button"' +
                         '           class="btn btn-xs btn-primary"' +
                         ' ng-click="grid.appScope.editWorkFile(' + workFileId + 
                         ')"' +
                         ' >Edit Ent' +
                         '</button>' +
                        ' </div>'   
        }
         $scope.gridOptions.onRegisterApi = function( gridApi ) {
            $scope.gridApi = gridApi;
            //$scope.gridApi.grid.registerRowsProcessor( $scope.singleFilter, 200 );
            //$scope.loadEntities();
            //gridApi.selection.on.rowSelectionChanged($scope,function(row){
            //    var msg = 'row selected ' + row.isSelected;
            //     $scope.selectedEnt = row.entity;
                
            //});
            //needs to be called to have rows selectable
            //$scope.gridApi = gridApi;
            $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.OPTIONS);
        };    


        $scope.loadEntityClasses = function(){
        EntityClass.query().$promise.then(
            function(eclasses){
                $scope.entityClasses = eclasses;
            }
          )
        };
        $scope.loadDistinctValues = function(){
            var ur = '/hive/v2/EntityQuery/DistinctVariableValues'
            ur = ur + '?_class=' + $scope.search.selectedEntityClass.name 
            ur = ur + '&variableName=' + $scope.search.classfield 
            ur = ur + '&_maxArrayLength=200'
            $http({method: 'GET', url: ur}).
            then(function(response) {
                    // its bigger than the 200 size limit - use manual search instead
                    if(Array.isArray(response.data) && response.data.length > 199){
                        $scope.entityFieldArrayHuge = true;
                    }else{
                          $scope.entityFieldArrayHuge = false;
                    }
                    $scope.search.distinctFieldVals = response.data;
                      
                    
                },
                function(response){
                    $scope.errorMessage=response;
                }
            );    
        }
        // show the entity fields and child entities select elements
        $scope.onSearchEntitySelected = function($item, $model){
            var x = $scope.search.selectedEntityClass;
            $scope.columnDefs = [{'field':'_entity_id',cellTemplate: entButton, width: 254}]

            $scope.search.classfields = Object.keys($scope.search.selectedEntityClass.variables)
            var idx = 0;
            for(idx = 0; idx < $scope.search.classfields.length; idx++){
                var varName = $scope.search.classfields[idx];
                var isFile = false;
                var varField;
                if($scope.search.selectedEntityClass.variables[varName].type == 'W'){
                    isFile = true
                }
                if(isFile){
                    varField = {field:varName,cellTemplate: wfButton, width: 254}
                }else{
                    varField = {field:varName}
                }
                $scope.columnDefs.push(varField)    
            }
            $scope.gridOptions.columnDefs =  $scope.columnDefs;
         //   $scope.gridApi.core.refresh();
            var ggg = 21;
        }
        $scope.searchFullText = function(start,count){
            if($scope.fullTextValue.length == 0){
                alert('must enter a search value');
                return false;
            }
            var urlStringCount = '/hive/v2/EntityQuery/All?_justCount=true' 
                                    + '&_full_text=' +$scope.fullTextValue
                                    + '&_class='+$scope.search.selectedEntityClass.name;
            var urlString = '/hive/v2/EntityQuery/All?_full_text=' 
                            +$scope.fullTextValue 
                            + "&_start=" + start 
                            + "&_count=" + count
                            + '&_class='+$scope.search.selectedEntityClass.name;
            if($scope.search.workFilesOnly){
                urlStringCount = urlStringCount + "&_wf=*";
                urlString = urlString + "&_wf=*";
            }
            $http({method: 'GET', url: urlStringCount}).
            then(function(response){
                $scope.totalEntityCount = response.data.entity_count; 
                $http({method: 'GET', url: urlString }).
                        then(function(response){
                        $scope.entityResults = response.data;

                        },
                        function(response){
                            $scope.errorMessage=response;
                        }
                               
                      )// inner then
                      })  
                ,function(response){alert(response)}
            

        }


        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.currentPage);
            var pageSize = 3;
            var start = (($scope.currentPage-1) * pageSize) + 1 ;

            $scope.searchFullText(start,pageSize)

        };
        $scope.searchSamples = function(){
            $http({method: 'GET', url: '/hive/v2/EntityQuery/All?maxArrayLength=10&platform.description=' + $scope.platform.desc}).
            then(function(response) {
                    $scope.samples = response.data;
                    $scope.gridOptions.data = $scope.samples;
                },
                function(response){alert(response)}
            );
        }
        $scope.searchEntity = function(){
            var queryS = "maxArrayLength=10&_class=" + $scope.search.selectedEntityClass.name + "&"
            queryS = queryS + $scope.search.classfield + '='+ $scope.search.classFieldSearchFor
            $http({method:'GET',url:'/hive/v2/EntityQuery/All?'+ queryS}).
            then(function(response){
                $scope.entityResults = response.data;
                $scope.gridOptions.data = response.data;
            },
            function(response){$scope.errorMessage=response}
            )
        }
        //Yes thats right , WorkFile editing code in 2 places! Oh my!
        // just much easier than using 2 controllers for the moment
        $scope.editWorkFile = function(row){
             WorkFile.queryOne({id:row},function(wfile){
                // need to make an array out of the single wf for the grid
                $scope.workFile = wfile
                $scope.wfOtherPerm = $scope.workFile.permissions.other[0]
                $scope.wfGroupPerm = $scope.workFile.permissions.other[0]
                $state.go('entities.editWorkFile',{workFile:$scope.workFile})
                var ee = 21;
            },function(error){
                $scope.gridOptions.data = [];
            })
            //$state.go('entities.editWorkFile')
            // need to copy first in case of cancel/rollback
            //$scope.workFile = angular.copy($scope.selectedWorkFile);
            //$scope.wfOtherPerm = $scope.workFile.permissions.other[0]
            //$scope.wfGroupPerm = $scope.workFile.permissions.other[0]   
            //$scope.subview = 'edit'; 
        }
        $scope.updateWorkFile = function(){
            $scope.workFile.$update({id:$scope.workFile.id},function(){
                $scope.successMessage = "Successfully Updated WorkFile " + $scope.workFile.id;
                var kkk = 32;
                var ggg = 20;
            });
        }
        $scope.showMainListing = function(){
            $state.go('entities.search')
        }
        $scope.editEntity = function(row){
            alert('Feature Coming Soon!')
        }
        $scope.init = function(){
            $scope.loadEntityClasses();
        }
        $scope.init();

        
    }])