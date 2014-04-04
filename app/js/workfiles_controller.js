var workFilesController = angular.module('geneHive.WorkFilesController', []);


workFilesController.controller('WorkFilesCtrl', ['$scope','$sortService','$http', 'WorkFile','GridService',
					 function($scope,$sortService,$http,WorkFile,GridService) {

 $scope.selectedWorkFiles	= [];
 $scope.filterOptions = {
      filterText: ''
    };
 var columnDefs= [
     {field:'id'},
        {field:"creator"},
        {field:'originalName'},
        {field:'fileType'},
        {field:'isTrashed'},
        {field:'isTransient'},
    ];
    GridService.initGrid($scope, $sortService, WorkFile, $scope.selectedWorkFiles, columnDefs);

}])