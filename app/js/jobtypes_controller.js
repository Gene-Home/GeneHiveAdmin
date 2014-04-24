var jobTypesController = angular.module('geneHive.JobTypesController', []);


jobTypesController.controller('JobTypesCtrl', ['$scope','$sortService','$http', 'JobType','GridService',
					 function($scope,$sortService,$http,JobType,GridService) {

 $scope.selectedJobTypes = [];
 $scope.jobTypeScript = "";
 $scope.filterOptions = {
      filterText: ''
    };
 var columnDefs= [
     {field:'name'},
        {field:"creator"},
        {field:'trashed'},
        {field:'public'}
    ];
 var getScript = function(jobTypeName){
     $http({method: 'GET', url: '/GeneHive/api/v2/JobTypeScripts/' + jobTypeName}).
        success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.jobTypeScript = data;
        }).
        error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert('not found')
        });

};
    GridService.initGrid($scope, $sortService, JobType, $scope.selectedJobTypes, columnDefs);

    $scope.$watch('selectedJobTypes', function(newValue, oldValue){
    // only make the call if selectedJobTypes has a length of at least 1
    if ($scope.selectedJobTypes.length ) {
        getScript(newValue[0].name)
    }   
    },true);

}])