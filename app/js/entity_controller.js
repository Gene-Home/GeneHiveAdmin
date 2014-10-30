var entitiesController = angular.module('geneHive.EntitiesController', []);

entitiesController.controller('EntitiesCtrl', ['$scope','$sortService','$http', 'Entity','GridService',
	function($scope,$sortService,$http,Entity,GridService) {

	// the currently selected entities in the display grid
	$scope.selectedEntities = [];
	var columnDefs=[{field:"name", displayName:'Name'},{field:"class", displayName:'Class'}];

	$scope.loadEntities = function(){
		Entity.query().$promise.then(
            function(ents){
                $scope.entities = ents;
            }
      	  )
    	};
	
	GridService.initGrid($scope,$sortService,Entity,$scope.selectedEntities,columnDefs).then($scope.loadEntities);	




}]);