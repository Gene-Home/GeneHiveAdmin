
var loginController = angular.module('geneHive.LoginController',[]);

loginController.controller('LoginCtrl',['$scope','$rootScope','$http','$state','AuthService',
   function ($scope,$rootScope,$http,$state,AuthService) {

     
      $scope.reminding = false;
      $scope.login = function(){
    	 var uname = $scope.userName;
    	 var password = $scope.password;
       $scope.bad_login = false;

    	 AuthService.login(uname,password)
    		  .then(function success(data) {
            // show the users profile
            $scope.bad_login = false;
            $state.go('index');
  					console.log('Success!', data);

			 }, function error(msg) {
            // let him know that he does not have one
            // if the code is 2 
            // otherwise something is broken 
  		  		console.error('Login Failure!', msg);
            $scope.bad_login = true;
			 });
    }// end login

    $scope.remindPassword = function () {

      AuthService.remindPassword($scope.email).then(
        function(success){
          alert('Email Sent');
          $scope.reminding = false;
        },function(fail){
          alert("Problem " + fail);
      })
    };// end createClass

    $scope.logout = function(){
        AuthService.logout();
    }

    if(! $state.current.data.logging_in){
        $scope.logout();
      } 
      
  }]);