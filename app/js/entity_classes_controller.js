var entityClassesController = angular.module('geneHive.EntityClassesController', []);

entityClassesController.controller('EntityClassesCtrl',['$scope','$http','$modal','$sortService','GridService','EntityClass',
	function($scope,$http,$modal,$sortService,GridService,EntityClass) {

		$scope.selectedEntityClasses = [];
		var columnDefs=[{field:"name", displayName:'Name'}];
		$scope.loadClasses = function(){
        EntityClass.query().$promise.then(
            function(eclasses){
                $scope.entityClasses = eclasses;
            }
      	  )
    	};
    	GridService.initGrid($scope, $sortService, EntityClass,$scope.selectedEntityClasses,columnDefs).then($scope.loadClasses);
        
    	$scope.editClass = function (modalName) {
        	var modalInstance = $modal.open({
            	templateUrl: 'partials/newClassModal.html',
            	controller: 'ClassModalController',
            	resolve: {
                	entityClasses: function(){
                    	return $scope.entityClasses;
                	},
                    entityClass: function(){
                        return $scope.selectedEntityClasses[0];
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
