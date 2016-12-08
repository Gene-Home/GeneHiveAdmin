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

entitiesController.controller('EntitySearchCtrl',['$scope','$http','Entity','EntityClass','uiGridConstants',
    function($scope,$http,Entity,EntityClass,uiGridConstants) {

        $scope.platforms = [];
        $scope.samples = [];
        $scope.platform = {};
        $scope.search = {};
        $scope.search.searchFor="Please Select";
        // remember it needs to be . somethinng so thats what the search if for
        $scope.search.selectedEntityClass = {};
        
        $scope.selectedEntities = [];
    var columnDefs=[
        {field:"name", displayName:'Name'},
        {field:"class", displayName:'Class'},
        {field:"owner",displayName:'Owner'},
        {field:"filenames",displayName:"Files"},
        {field:"creationDate",displayName:"Created"}

    ];
        $scope.gridOptions = {
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            columnDefs: columnDefs,
            enableFullRowSelection: true,
            multiSelect: false,
            noUnselect: true
        };
    
         $scope.gridOptions.onRegisterApi = function( gridApi ) {
            $scope.gridApi = gridApi;
            //$scope.gridApi.grid.registerRowsProcessor( $scope.singleFilter, 200 );
            //$scope.loadEntities();
            //gridApi.selection.on.rowSelectionChanged($scope,function(row){
            //    var msg = 'row selected ' + row.isSelected;
            //     $scope.selectedEnt = row.entity;
                
            //});
            //needs to be called to have rows selectable
            $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.OPTIONS);
        };    


        $scope.loadEntityClasses = function(){
        EntityClass.query().$promise.then(
            function(eclasses){
                $scope.entityClasses = eclasses;
            }
          )
        };
        $scope.loadPlatforms = function(){
            $http({method: 'GET', url: '/hive/v2/EntityQuery/DistinctVariableValues?variableName=description&class=platdformd'}).
            then(function(response) {
                    $scope.platforms = response.data;
                },
                function(response){alert(response)}
            );
        
        };
        $scope.loadDistinctValues = function(){
            var ur = '/hive/v2/EntityQuery/DistinctVariableValues'
            ur = ur + '?_class=' + $scope.search.selectedEntityClass.name 
            ur = ur + '&variableName=' + $scope.search.classfield 
            $http({method: 'GET', url: ur}).
            then(function(response) {
                    $scope.distinctVals = response.data;
                },
                function(response){alert(response)}
            );    
        }
        // show the entity fields and child entities select elements
        $scope.onSearchEntitySelected = function($item, $model){
            var x = $scope.search.selectedEntityClass;
            $scope.search.classfields = Object.keys($scope.search.selectedEntityClass.variables)
            var ggg = 21;
        }
        $scope.searchSamples = function(){
            $http({method: 'GET', url: '/hive/v2/EntityQuery/All?platform.description=' + $scope.platform.desc}).
            then(function(response) {
                    $scope.samples = response.data;
                    $scope.gridOptions.data = $scope.samples;
                },
                function(response){alert(response)}
            );
        }
        $scope.searchEntity = function(){
            var queryS = "_class=" + $scope.search.selectedEntityClass.name + "&"
            queryS = queryS + $scope.search.classfield + '='+ $scope.search.classFieldSearchFor
            $http({method:'GET',url:'/hive/v2/EntityQuery/All?'+ queryS}).
            then(function(response){
                $scope.entityResults = response.data;
            },
            function(response){alert(response)}
            )
        }
        $scope.init = function(){
            $scope.loadPlatforms();
            $scope.loadEntityClasses();
        }
        $scope.init();

        
    }])