var usersController = angular.module('geneHive.UsersController', []);


usersController.controller('UsersCtrl', ['$scope','$http','$uibModal', 'User','WorkFile','UserGroup','JobRun','uiGridConstants',
					 function($scope,$http,$uibModal,User,WorkFile,UserGroup,JobRun, uiGridConstants) {

    
    // default to the listing view
    $scope.subview = 'list';
    // seems dumb but easiest way to get spinner not to show for wf sizes
    $scope.workFilesLoaded = true; 
    $scope.getInclude = function(){
      if ($scope.subview == 'list'){
          return 'partials/users.html'
      }else{
        return 'partials/userEdit.html'
      }
    }
    $scope.listUsers = function(){
      $scope.subview ='list';
    }                    

    $scope.saveNewUser = function(){
        //scrape the names off the groups and set them to the user
        $scope.user.groups = $scope.bsObj.editedUserGroups.map(function(grp){return grp.name});
        User.create({},$scope.user).$promise.then(
            function(user){
                $scope.errorMessage = null;
                $scope.successMessage = "Successfully Created User: " + user.username;
                $scope.createSuccess = true;
            },function(message){
                $scope.errorMessage = "ErrorCreating User: " + message.data; 
            }
        )
    }
    $scope.updateUser = function(){
        //scrape the names off the groups and set them to the user
        $scope.user.groups = $scope.bsObj.editedUserGroups.map(function(grp){return grp.name});    
        User.update({ uname:$scope.user.username }, $scope.user).$promise.then(
            function(user){
                // set the success message
                $scope.successMessage = "User Has Been Updated";
                // set to viewing
                $scope.editing = false;
                $scope.viewing = true;
                $scope.newing = false;
                //update the user in the grid
                $scope.selectedUser = angular.copy(user);

            },
            function(message){
                // set the message
                $scope.errorMessage  = "Error Creating User: " + message.data;
            }
            )
    };// end updateUser

    $scope.loadAllUsers = function(){
        User.query(function(data){
            $scope.gridOptions.data = data;
        })
    }
    $scope.loadUserGroups = function(){
        UserGroup.query().$promise.then(
            function(groups){
                $scope.userGroups = [{name:'All Groups'}];
                $scope.userGroups = $scope.userGroups.concat(groups);
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
         $scope.editing = true;
        // need to copy first in case of cancel/rollback
        $scope.user = angular.copy($scope.selectedUser);
        // need to convert user.groups from just string array to proper Group objects
        $scope.bsObj.editedUserGroups = $scope.user.groups.map(function(gname){return {name: gname} });
        $scope.subview = 'edit';
    }
    $scope.newUser = function(){
        //blank user
        $scope.user = {};
    }
    // start off viewing the current user
    $scope.user = {};
    // need this when editiing a user and yes, this is BS
    // have to add editedUserGroups to some dummy obj because
    // it MUST have a dot in it for ui-select!
    $scope.bsObj = {};
    $scope.bsObj.editedUserGroups = [];
    $scope.bsObj.selectedGroup = {name: "All Groups"};
    // array to store the selected users from the grid
    // we are not allowing multi select so there will be 
    // only one user -- [0]
    $scope.selectedUser = [];
    var columnDefs= [
        {field: 'username'},
        {field: 'group',displayName: 'default group'},
        {field:'email'},
        {field:'dateJoined', cellFilter:'date:\'MM/dd/yyyy\''},
        {field:'active'},
        {field: 'superuser'}
    ];
    $scope.gridOptions = {
        enableSorting: true,
        enableRowSelection: true,
        columnDefs: columnDefs,
        enableFullRowSelection: true,
        multiSelect: false,
        noUnselect: true,
        selectedItems: $scope.selectedUser
    
    };
  
    $scope.gridOptions.onRegisterApi = function( gridApi ) {
            $scope.gridApi = gridApi;
            $scope.gridApi.grid.registerRowsProcessor( $scope.singleFilter, 200 );
            $scope.loadUserGroups();
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                var msg = 'row selected ' + row.isSelected;
                $scope.selectedUser = row.entity;
                $scope.clearMessages();  
                // TODO these should be chained
                loadWorkFiles($scope.selectedUser.username);
                //load the new ones
                loadJobRuns($scope.selectedUser.username);
                
            });
            //needs to be called to have rows selectable
            $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.OPTIONS);
    };
    $scope.singleFilter = function( renderableRows ){
        var ddd = $scope.bsObj.selectedGroup.name;
        var matcher = new RegExp(ddd);
        renderableRows.forEach( function( row ) {
            var match = false;
            row.entity.groups.forEach(function(gname){
                if(gname == ddd || ddd == "All Groups"){
                    match = true;
                }
            });
            if ( !match ){
                row.visible = false;
            }
        });
        return renderableRows;
    };
    $scope.filter = function() {
        $scope.gridApi.grid.refresh();
    };
    
    
    // from http://scratch99.com/web-development/javascript/convert-bytes-to-mb-kb/
    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return 'n/a';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i == 0) return bytes + ' ' + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    };
    var loadWorkFiles  = function(userName){
     $scope.workFilesLoaded = false;   
     WorkFile.query({creator: userName}).$promise.then(function(wfiles){
                $scope.workFiles = wfiles;
                $scope.totalFileSize = 0;
                $scope.largestFileSize = 0;

                angular.forEach($scope.workFiles, function(val,key){
                    if(!val.length){
                        val.length = 0;
                    } 
                    $scope.totalFileSize += parseInt(val.length);
                    if(val.length > $scope.largestFileSize){
                        $scope.largestFileSize = val.length;
                    } 
                });
                // convert all to human readable units
                $scope.totalFileSize = bytesToSize($scope.totalFileSize);
                $scope.largestFileSize = bytesToSize($scope.largestFileSize);
                $scope.workFilesLoaded = true;
        })
    };
    var loadJobRuns = function(userName){
        $scope.jobRunsLoaded = false;
        JobRun.query({creator:userName}).$promise.then(function(jobRuns){
            // clear out , could be from last user
            $scope.jobRuns = jobRuns;
            $scope.earliestJobRunDate = null;
            $scope.latestJobRunDate = null;
            $scope.aveJobRunDuration = 0;
            $scope.longestJobRunDuration = 0;
            $scope.jobRunsLoaded = true;
            // if there are none, just return
            if (jobRuns.length == 0){
                return; 
            }
            // safe early and latest dates
            $scope.earliestJobRunDate = new Date();
            $scope.latestJobRunDate = new Date(1934, 10, 30);
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
        var modalInstance = $uibModal.open({
            templateUrl: 'partials/newGroupModal.html',
            controller: 'UserGroupModalController'
        });
        modalInstance.result.then(function (response) {
            $scope.loadUserGroups()
            console.log(response);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    $scope.createUser = function(){
        $scope.user = {};
        $scope.createSuccess = false;
         $scope.editing = false;
        // need to convert user.groups from just string array to proper Group objects
        //$scope.bsObj.editedUserGroups = $scope.user.groups.map(function(gname){return {name: gname} });
        $scope.subview = 'edit';
    }
    $scope.createUser99 = function (modalName) {
        var modalInstance = $uibModal.open({
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
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    var initUsers = function(){
        $scope.loadAllUsers();
    }
    initUsers();

// dont really need this any more -- just delete?
$scope.$watch('selectedUser', function(newValue, oldValue){
    // only make the call if the selectedUser has a length of at least 1
    // its an array so just make sure its not empty
    // AND ensure that the change is due to a grid click -- otherwise this will
    // trigger when user fields are edited
    if ($scope.selectedUser.length > 0 && (oldValue.length == 0 || newValue[0].username != oldValue[0].username)) {
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