  
var sysConfControllers = angular.module('geneHive.SysConfControllers', []);


sysConfControllers.controller('executionConfCtrl',['$scope','$http','$uibModal','ExeLocation',
    function($scope,$http,$uibModal,ExeLocation){

  $scope.exeLocations = {};
  $scope.subview = 'list';
  $scope.getInclude = function(){
      if ($scope.subview == 'list'){
          return 'partials/executionConfList.html'
      }else if ($scope.subview == 'new'){
        return 'partials/executionConfNew.html'
      }
    }
  $scope.listExeLocations = function(){
      $scope.subview ='list';
  }
  $scope.loadLocations = function(){
    ExeLocation.query(function(locs){
      $scope.exeLocations = []
      for (i = 0; i<locs.length; i++){
        locs[i].idx = i;
        $scope.exeLocations.push(locs[i]);
      }
    })
  }
  var getExeLocation = function(){
     $http({method: 'GET', url: '/hive/v2/ExecutionLocations'}).
        success(function(data, status, headers, config) {
          $scope.exeLocations = data;
        }).
        error(function(data, status, headers, config) {})
  };
  $scope.addExeLocation = function(){
      $scope.newLoc = {};
      $scope.successMessage = undefined;
      $scope.errorMessage = undefined;
      $scope.action = 'creating';
      $scope.subview = 'new';
    };
  $scope.editLocation = function(locIdex){
        // editing the currentUser
        // need to copy first in case of cancel/rollback
        $scope.newLoc = angular.copy($scope.exeLocations[locIdex]);
        $scope.successMessage = undefined;
        $scope.errorMessage = undefined;
        $scope.action = 'editing';
        $scope.subview = 'new';
    };
  $scope.saveExeLocation = function(){
     // so we can put a spinner on the button or something
      $scope.saving = true;
      if($scope.action == 'creating'){  
            ExeLocation.save({},$scope.newLoc).$promise.then(
                function(location){
                    $scope.errorMessage = null;
                    $scope.successMessage = "Successfully Created Location: " + location.name;
                    $scope.newLoc = angular.copy(location,$scope.newLoc);
                    $scope.saving = false;
                    // seriously man ... chain these things
                    $scope.listExeLocations();
                    $scope.loadLocations()
                },
                function(message){
                    $scope.errorMessage = "Error Creating Location: " + message.data;
                    $scope.saving = false;
                }
            )
        };
        if($scope.action == 'editing'){
          ExeLocation.update({exeLocName:$scope.newLoc.name},$scope.newLoc).$promise.then(
                function(location){
                    $scope.errorMessage = null;
                    $scope.successMessage = "Successfully Updated Location: " + location.name;
                    $scope.newLoc = angular.copy(location,$scope.newLoc);
                    $scope.saving = false;
                    // seriously man ... chain these things
                    $scope.listExeLocations();
                    $scope.loadLocations()
                },
                function(message){
                    $scope.errorMessage = "Error Updating Location: " + message.data;
                    $scope.saving = false;
                }
            )  
        };

    }
    $scope.loadLocations();
  }]
  );// end 




sysConfControllers.controller('SysConfCtrl2',['$scope','$http','$uibModal',function($scope,$http,$uibModal) {

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