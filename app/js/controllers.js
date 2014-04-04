'use strict';

/* Controllers */
/** 
    Well the controllers that are small enough not to 
    merit thier own files anyway
**/

var geneHiveControllers = angular.module('geneHiveControllers', []);

geneHiveControllers.controller('UserModalController', function modalController ($scope, $modalInstance,User,userGroups) {
    
    $scope.newUser = {};
    $scope.userGroups = userGroups;
    $scope.createSuccess = false;
    $scope.createUser = function(){
      User.create({},$scope.newUser).$promise.then(
        function(user){
          $scope.errorMessage = null;
          $scope.successMessage = "Successfully Created User: " + user.username;
          $scope.newUser = angular.copy(user,$scope.newUser)
          $scope.createSuccess = true;
        },
        function(message){
          $scope.errorMessage = "Error Creating User: " + message.data;
        }
      )
    }; //end createUser
    $scope.ok = function () {
        $modalInstance.close({'newUser': $scope.newUser});
        console.log('ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        console.log('cancel');
    };
});


geneHiveControllers.controller('UserGroupModalController', function modalController ($scope, $modalInstance,UserGroup) {
    
    $scope.newGroup = {};
    $scope.successCreate = false; 
    $scope.createGroup = function(){
      UserGroup.create({},$scope.newGroup).$promise.then(
        function(group){
          $scope.errorMessage = null;
          $scope.successMessage = "Success Creating Group: " + group.name;
          $scope.newGroup = angular.copy(group,$scope.newGroup)
          $scope.successCreate = true;
        },
        function(message){
          $scope.errorMessage = "Error Creating: " + message.data;
        }
      )
    }; //end create Group
    $scope.ok = function () {
        $modalInstance.close({'newGroup':$scope.newGroup});
        console.log('ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        console.log('cancel');
    };
});

