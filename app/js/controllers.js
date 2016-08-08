'use strict';

/* Controllers */
/** 
    Well the controllers that are small enough not to 
    merit thier own files anyway
**/

var geneHiveControllers = angular.module('geneHiveControllers', []);

geneHiveControllers.controller('TestEmailController',['$scope','$uibModalInstance',function modalController ($scope, $uibModalInstance){
  
  
    $scope.ok = function () {
        $uibModalInstance.close({'newUser': $scope.newUser});
        console.log('ok');
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        console.log('cancel');
    };
  }]
); 


geneHiveControllers.controller('ClassModalController', 
  function modalController($scope,$uibModalInstance,EntityClass,entityClass,entityClasses,isCreating){
    $scope.isCreating = isCreating;
    $scope.newClass = entityClass;
    $scope.newVariable = {};
    $scope.newCode = {};
    $scope.createSuccess = false;
    $scope.entityClasses = entityClasses;
    $scope.removeVariable = function(varName){
      delete $scope.newClass.variables[varName];
    };
    $scope.addVariable = function(){

      var newName = $scope.newVariable.name
      // there could be no variables in the class
      // so need to add if null
      if($scope.newClass.variables == null ){
        $scope.newClass.variables = {};
      }
      // remove the name field before saving
      delete $scope.newVariable.name 
      $scope.newClass.variables[newName] = $scope.newVariable;
      $scope.newVariable = {};
    };
    $scope.removeCode = function(code){
      delete $scope.newVariable.codes[code];
    }
    $scope.addCode = function(){
      if($scope.newVariable.codes == null){
        $scope.newVariable.codes = {};
      } 
      $scope.newVariable.codes[$scope.newCode.code] = $scope.newCode.name;

    }
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
      EntityClass.update({'entityClassName':$scope.newClass.name},$scope.newClass).$promise.then(
        function(entityClass){
          $scope.errorMessage = null;
          $scope.successMessage = "Successfully Updated Class: " + entityClass.name;
          $scope.newClass = angular.copy(entityClass,$scope.newClass)
          $scope.createSuccess = true;
        },
        function(message){
          $scope.errorMessage = "Error Updating Class: " + message.data;
        })
    }
    $scope.createClass = function(isValid){
      $scope.submitted = true;
      if(!isValid){
        return;
      }
      EntityClass.create({},$scope.newClass).$promise.then(
        function(entityClass){
          $scope.errorMessage = null;
          $scope.successMessage = "Successfully Created Class: " + entityClass.name;
          $scope.newClass = angular.copy(entityClass,$scope.newClass)
          $scope.createSuccess = true;
        },
        function(message){
          $scope.errorMessage = "Error Creating Class: " + message.data;
        }
      )
    }; //end createClass
    $scope.ok = function () {
        $uibModalInstance.close({'newClass': $scope.newClass});
        console.log('ok');
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        console.log('cancel');
    };
  }
)// end ClassModalController

geneHiveControllers.controller('UserGroupModalController', function modalController ($scope, $uibModalInstance,UserGroup) {
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
        $uibModalInstance.close({'newGroup':$scope.newGroup});
        console.log('ok');
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        console.log('cancel');
    };
});

geneHiveControllers.controller('SysConfCtrl',['$scope','$http','$uibModal',function($scope,$http,$uibModal) {

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
      $scope.sysConf['policy.user-change-tokens'];
    toSave['template.user-confirm-api-body'] = 
      $scope.sysConf['template.user-confirm-api-body'];
    toSave['template-user-confirm-url-body'] = 
      $scope.sysConf['template-user-confirm-url-body'];
        
    $http({method: 'POST', data:toSave,url: '/hive/v2/Configuration'}).
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

    $http({method: 'POST', data:toSave,url: '/hive/v2/Configuration'}).
        success(function(data, status, headers, config) {
            $scope.updateSmtpConfSuccess = true;
        }).
        error(function(data, status, headers, config) {
            $scope.updatedSmtpConfFailure = true;
            $scope.errorData = data;
        });
    };
  var getExeLocation = function(){
     $http({method: 'GET', url: '/hive/v2/ExecutionLocations'}).
        success(function(data, status, headers, config) {
          $scope.exeLocations = data;
        }).
        error(function(data, status, headers, config) {})
  };
  var getStorageLocations = function(){
    $http({method: 'GET', url: '/hive/v2/WorkFileStorage/?parameters=true'}).
        success(function(data, status, headers, config) {
          $scope.storageLocations = data;
        }).
        error(function(data, status, headers, config) {})
  };  
  var getConf = function(){
     $http({method: 'GET', url: '/hive/v2/Configuration'}).
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
      $http({method: 'POST', data: $scope.sysConf,url: '/hive/v2/MailTest'}).
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
geneHiveControllers.controller('StorageConfModalController', function modalController ($scope, $uibModalInstance,StorageLocation,locationName) {
    
    $scope.locName = locationName;
    $scope.deleteLocations = function(){
      StorageLocation.delete({wfsName:$scope.locName},{}).$promise.then(
        function(message){
          $scope.errorMessage = null;
          // its odd, if we use the retured message, its an array .. hmm
          //$scope.successMessage = message;
          $scope.successMessage = "Successfully Remove Location: " + locationName 
        },
        function(message){
          $scope.errorMessage = "Error Removing Location: " + message.data;
        }    
      )
    }

    $scope.ok = function () {

        $uibModalInstance.close('delete');
        console.log('ok');
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        console.log('cancel');
    };
});
geneHiveControllers.controller('UserModalController', function modalController ($scope, $uibModalInstance,User,userGroups) {
    
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
        $uibModalInstance.close({'newUser': $scope.newUser});
        console.log('ok');
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        console.log('cancel');
    };
});


geneHiveControllers.controller('UserGroupModalController', function modalController ($scope, $uibModalInstance,UserGroup) {
    
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
        $uibModalInstance.close({'newGroup':$scope.newGroup});
        console.log('ok');
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        console.log('cancel');
    };
});

