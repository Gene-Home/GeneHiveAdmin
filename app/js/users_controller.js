var usersController = angular.module('geneHive.UsersController', []);

usersController.controller('UserCtrl',['$scope','$http', function($scope,$http){
    var su = $s
}

])
usersController.controller('UsersCtrl', ['$scope','$http', 'User','WorkFile','UserGroup','JobRun',
    function($scope,$http,User,WorkFile,UserGroup,JobRun) {

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

    $scope.createUser = function(){
        User.create({}, $scope.user).$promise.then(
            function(user){
                // set the success message
                $scope.successMessage = "User Has Been Created";
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
    };
    $scope.loadUserGroups = function(){
        UserGroup.query().$promise.then(
            function(groups){
                $scope.userGroups = groups;
            }
        )
    };


    // start off viewing the current user
    $scope.user = {};
    $scope.viewing = true;
    $scope.editing = false;
    $scope.newing = false;
    // load user groups -- its async 
    $scope.loadUserGroups();
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
    $scope
 	$scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    }; 
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [250, 500, 1000],
        pageSize: 250,
        currentPage: 1
    };	
    $scope.setPagingData = function(data, page, pageSize){	
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('/GeneHive/api/v2/Users/').success(function (largeLoad) {		
                    data = largeLoad.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                });            
            } else {
                $http.get('/GeneHive/api/v2/Users/').success(function (largeLoad) {
                    $scope.setPagingData(largeLoad,page,pageSize);
                     
                });
            }
        }, 100);
    };
	
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

$scope.selectedUser = [];

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
}   	

$scope.$watch('selectedUser', function(newValue, oldValue){
    // only make the call if the selectedUser has a length of at least 1
    // its an array so just make sure its not empty
    // AND the user is just being viewed -- otherwise this will
    // trigger when user fields are edited
    if ($scope.selectedUser.length > 0 && $scope.viewing) {
        $scope.clearMessages();  
        // TODO these should be chained
        loadWorkFiles(newValue[0].username);
        //load the new ones
        loadJobRuns(newValue[0].username);
    }   
},true);
    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
		showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs: [
            {field:'username', displayName:'UserName'},
          	{field:"group", displayName:'Group'},
        	{field:'email', displayName:'Email'},
        	{field:'dateJoined', displayName:'Join Date', cellFilter:'date:\'MM/dd/yyyy\''},
          	{field:'active',displayName:'Active',width:'60'}
        ],
        multiSelect: false,
        selectedItems: $scope.selectedUser
    };


}
])