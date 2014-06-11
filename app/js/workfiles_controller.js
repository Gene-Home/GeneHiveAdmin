var workFilesController = angular.module('geneHive.WorkFilesController', []);


workFilesController.controller('WorkFilesCtrl', ['$scope','$sortService','$http', 'WorkFile','GridService',
					 function($scope,$sortService,$http,WorkFile,GridService) {

 $scope.selectedWorkFiles	= [];
 $scope.filterOptions = {
      filterText: ''
    };
 var columnDefs= [
     {field:'id',width: 60},
        {field:"creator"},
        {field: "creationDatetime"},
        {field:'originalName'},
        {field:'fileType'},
        {field:'length'},
        {field:'isTrashed',width: 80},
        {field:'isTransient',width: 80},
    ];
    GridService.initGrid($scope, $sortService, WorkFile, $scope.selectedWorkFiles, columnDefs);

}])