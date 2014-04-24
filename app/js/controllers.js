'use strict';

/* Controllers */
/** 
    Well the controllers that are small enough not to 
    merit thier own files anyway
**/

var geneHiveControllers = angular.module('geneHiveControllers', []);

geneHiveControllers.controller('TestEmailController',['$scope','$modalInstance',function modalController ($scope, $modalInstance){
  
  
    $scope.ok = function () {
        $modalInstance.close({'newUser': $scope.newUser});
        console.log('ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        console.log('cancel');
    };
  }]
); 

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

geneHiveControllers.controller('SysConfCtrl',['$scope','$http','$modal',function($scope,$http,$modal) {

  $scope.sysConf = {};
  $scope.updateLoginConf = function(){
    // set only: template.password-reset-subject,policy.public-user-creation,
    // template.password-reset-api-body,template.password-reset-url-body,
    // policy.user-change-tokens
    var toSave = {};
    toSave['template.password-reset-subject'] = 
      $scope.sysConf['template.password-reset-subject'];
    toSave['policy.public-user-creation'] = 
      $scope.sysConf['policy.public-user-creation'];
    toSave['template.password-reset-api-body'] = 
      $scope.sysConf['template.password-reset-api-body'];
    toSave['template.password-reset-url-body'] = 
      $scope.sysConf['template.password-reset-url-body'];
    toSave['policy.user-change-tokens'] = 
      $scope.sysConf['policy.user-change-tokens'];
    toSave['policy.user-change-tokens'] = 
      $scope.sysConf['template.user-confirm-subject'];
    toSave['template.user-confirm-api-body'] = 
      $scope.sysConf['template.user-confirm-api-body'];
    toSave['template-user-confirm-url-body'] = 
      $scope.sysConf['template-user-confirm-url-body'];
        
    $http({method: 'POST', data:toSave,url: '/GeneHive/api/v2/Configuration'}).
      success(function(data, status, headers, config) {
        $scope.updateLoginConfSuccess = true;
      }).
      error(function(data, status, headers, config) {
        $scope.updatedLoginConfFailure = true;
        $scope.errorData = data;
      });
  }
  $scope.updateSmtpConf = function(){
    // set only : SMTP FROM ADDRESS, SMTP EMAIL USER, SMTP PORT, SMTP HOST
    // SMTP PASSWORD, SMTP TTLS
    var toSave = {};
    toSave['mail.smtp.host'] = $scope.sysConf['mail.smtp.host'];
    toSave['mail.smtp.port'] = $scope.sysConf['mail.smtp.port'];
    toSave['mail.smtp.user'] = $scope.sysConf['mail.smtp.user'];
    toSave['mail.smtp.password'] = $scope.sysConf['mail.smtp.password'];
    toSave['mail.smtp.from'] = $scope.sysConf['mail.smtp.from'];
    toSave['mail.smtp.starttls.enable'] = $scope.sysConf['mail.smtp.starttls.enable'];

    $http({method: 'POST', data:toSave,url: '/GeneHive/api/v2/Configuration'}).
        success(function(data, status, headers, config) {
            $scope.updateSmtpConfSuccess = true;
        }).
        error(function(data, status, headers, config) {
            $scope.updatedSmtpConfFailure = true;
            $scope.errorData = data;
        });
    };
  var getExeLocation = function(){
     $http({method: 'GET', url: '/GeneHive/api/v2/ExecutionLocations'}).
        success(function(data, status, headers, config) {
          $scope.exeLocations = data;
        }).
        error(function(data, status, headers, config) {})
  }  
  var getConf = function(){
     $http({method: 'GET', url: '/GeneHive/api/v2/Configuration'}).
        success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.sysConf = data;
        if (data['policy.public-user-creation'] == "true")
          $scope.sysConf['policy.public-user-creation'] = true;
        else
          $scope.sysConf['policy.public-user-creation'] = false;
        if (data['policy.user-change-tokens'] == "true")
           $scope.sysConf['policy.user-change-tokens'] = true;
        else 
          $scope.sysConf['policy.user-change-tokens'] = false;
        if (data['mail.smtp.starttls.enable'] == "true") 
        $scope.sysConf['mail.smtp.starttls.enable'] = true;
        else 
          $scope.sysConf['mail.smtp.starttls.enable'] = false;

        }).
        error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert('error')
        }).then(getExeLocation());

    };
    
    $scope.testEmail = function(){
      $scope.sending = true;  
      $scope.testResultsSuccess = null;
      $scope.testResultsError = null;
      $http({method: 'POST', data: $scope.sysConf,url: '/GeneHive/api/v2/MailTest'}).
        success(function(data, status, headers, config) {
            $scope.sending = false;
            $scope.testResultsSuccess = data;
        }).
        error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.sending = false;
            $scope.testResultsError = data;
        });
    };

    

    $scope.sending = false;
    getConf();

            $scope.updateConf = function(){

            }
          }

]);
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

