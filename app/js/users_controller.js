var usersController = angular.module('geneHive.UsersController', []);


usersController.controller('UsersCtrl', ['$scope','$sortService','$http','$modal', 'User','WorkFile','UserGroup','JobRun','GridService',
					 function($scope,$sortService,$http,$modal,User,WorkFile,UserGroup,JobRun,GridService) {

               
    $scope.filterOptions = {
      filterText: ''
    }; 
    $scope.updateUser = function(){
        User.update({ uname:$scope.user.username }, $scope.user).$promise.then(
            function(user){
                // set the success message
                $scope.successMessage = "User Has Been Updated";
                // set to viewing
                $scope.editing = false;
                $scope.viewing = true;
                $scope.newing = false;
                //update the user in the grid
                $scope.selectedUser[0] = angular.copy(user); 
            },
            function(message){
                // set the message
                $scope.errorMessage  = "Error Creating User: " + message.data;
            }
            )
    };// end updateUser

    $scope.loadUserGroups = function(){
        UserGroup.query().$promise.then(
            function(groups){
                $scope.userGroups = groups;
            }
        )
    };
    /**
      Clears both the error and success
      messages from $scope
    */
    $scope.clearMessages = function(){
        $scope.errorMessage = null;
        $scope.successMessage = null;
    }
    $scope.editUser = function(){
        // editing the currentUser
        // need to copy first in case of cancel/rollback
        $scope.user = angular.copy($scope.selectedUser[0]);
    }
    $scope.newUser = function(){
        //blank user
        $scope.user = {};
    }
    // start off viewing the current user
    $scope.user = {};
    $scope.viewing = true;
    $scope.editing = false;
    $scope.newing = false;
    
    // array to store the selected users from the grid
    // we are not allowing multi select so there will be 
    // only one user -- [0]
    $scope.selectedUser = [];
    var columnDefs= [
        {field:'username'},
        {field:"group"},
        {field:'email'},
        {field:'dateJoined', cellFilter:'date:\'MM/dd/yyyy\''},
        {field:'active',width:'60'}
    ];
    // Loads up the users and groups
    GridService.initGrid($scope, $sortService, User, $scope.selectedUser, columnDefs).then(
        function(){
            $scope.loadUserGroups();
        }
    );

    var loadWorkFiles  = function(userName){
     WorkFile.query({creator: userName}).$promise.then(function(wfiles){
                $scope.workFiles = wfiles;
                $scope.totalFileSize = 0;
                $scope.largestFileSize = 0;
                angular.forEach($scope.workFiles, function(val,key){
                    $scope.totalFileSize += parseInt(val.id);
                    if(val.id > $scope.largestFileSize){
                        $scope.largestFileSize = val.id;
                    } 
                })
        })
    };
    var loadJobRuns = function(userName){
        JobRun.query({creator:userName}).$promise.then(function(jobRuns){
            // clear out , could be from last user
            $scope.jobRuns = jobRuns;
            $scope.earliestJobRunDate = null;
            $scope.latestJobRunDate = null;
            $scope.aveJobRunDuration = 0;
            $scope.longestJobRunDuration = 0;
            // if there are none, just return
            if (jobRuns.length == 0){
                return; 
            }
            $scope.earliestJobRunDate = new Date(jobRuns[0].runDatetime);
            $scope.latestJobRunDate = new Date(jobRuns[0].runDatetime);
            $scope.aveJobRunDuration = 0;
            $scope.longestJobRunDuration = 0;
            var totalDuration = 0; 
            angular.forEach(jobRuns,function(val,key){
                var jobDuration = 0;
                var runDate = new Date(val.runDatetime);
                var stopDate = new Date(val.stopDatetime);

                if (val.status == 'COMPLETE'){
                    jobDuration = Math.abs(stopDate - runDate);
                }
                if (jobDuration > $scope.longestJobRunDuration){
                    $scope.longestJobRunDuration = jobDuration;
                }
                totalDuration += jobDuration; 
                if(runDate < $scope.earliestJobRunDate ){
                    $scope.earliestJobRunDate = runDate;
                }
                if(runDate > $scope.latestJobRunDate ){
                    $scope.latestJobRunDate = runDate;
                }
            })// end forEach
            if (jobRuns.length > 0){
                $scope.aveJobRunDuration = totalDuration / jobRuns.length;
            }
        })
    } // end loadJobRuns  	
// modal stuff

    $scope.createGroup = function (modalName) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/newGroupModal.html',
            controller: 'UserGroupModalController'
        });
        modalInstance.result.then(function (response) {
            console.log(response);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    $scope.createUser = function (modalName) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/newUserModal.html',
            controller: 'UserModalController',
            resolve: {
                userGroups: function(){
                    return $scope.userGroups;
                }
            }

        });
        modalInstance.result.then(function (response) {
            console.log(response);
        }, function () {
            var ggg = 32;
            console.log('Modal dismissed at: ' + new Date());
        });
    };



$scope.$watch('selectedUser', function(newValue, oldValue){
    // only make the call if the selectedUser has a length of at least 1
    // its an array so just make sure its not empty
    // AND ensure that the change is due to a grid click -- otherwise this will
    // trigger when user fields are edited
    if ($scope.selectedUser.length > 0 && newValue[0].username != oldValue[0].username) {
        // set to viewing
        $scope.viewing = true;
        $scope.editing = false;
        $scope.clearMessages();  
        // TODO these should be chained
        loadWorkFiles(newValue[0].username);
        //load the new ones
        loadJobRuns(newValue[0].username);
    }   
},true);
}
])