var workFilesController = angular.module('geneHive.WorkFilesController', []);


workFilesController.controller('WorkFilesCtrl', ['$scope','$http','$filter','User','WorkFile','UserGroup','uiGridConstants',
					 function($scope,$http,$filter,User,WorkFile,UserGroup,uiGridConstants) {


    // default to the listing view
    $scope.subview = 'list';                    
    $scope.getInclude = function(){
      if ($scope.subview == 'list'){
          return 'partials/workFiles.html'
      }else{
        return 'partials/workFileEdit.html'
      }
    }
    $scope.selectedWorkFiles	= [];
    $scope.doneSearching = true;
    $scope.filterOptions = {
      filterText: ''
    };
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };   
    var columnDefs= [
     {field:'id',width: 60},
        {field:"creator"},
        {field: "group"},
        {field: 'storage'},
        {field: "creationDatetime"},
        {field:'originalName'},
        {field:'fileType'},
        {field:'length',width: 80},
        {field:'isTrashed',width: 80},
    ];
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        useExternalPagination: true,
        enableSorting: false,
        enableRowSelection: true,
        columnDefs: columnDefs,
        enableFullRowSelection: true,
        multiSelect: false,
        noUnselect: true,
        selectedItems: $scope.selectedJobRuns
    
    };
    // it MUST have a dot in it for ui-select!
    $scope.bsObj = {};
    $scope.listWorkFiles = function(){
        $scope.subview = "list";
        loadWorkFiles();
    }
    var loadWorkFiles = function(){
        WorkFile.query(function(wfiles){
            $scope.gridOptions.data = wfiles;
        })
    };
    $scope.loadUsersAndGroups = function(){
        User.query(function(data){
            $scope.users = [{username:'Any User'}]
            data = $filter('orderBy')(data,'username')
            $scope.users = $scope.users.concat(data);
            $scope.loadUserGroups()
        })
    }
    $scope.loadUserGroups = function(){
        UserGroup.query().$promise.then(
            function(groups){
                // makes it easier for the edit workfile select
                // if we use an array of group names rather
                // than group objects
                groups = $filter('orderBy')(groups,'name');
                $scope.groupNames = ['Any Group']
                groups.map(function(g){$scope.groupNames.push(g.name)})
            
            }
        )
    };
    /**
     Prepare for and display the workfile editing page
    **/
    $scope.editWorkFile = function(){
         // editing the currentUser
        // need to copy first in case of cancel/rollback
        $scope.workFile = angular.copy($scope.selectedWorkFile);
        $scope.wfOtherPerm = $scope.workFile.permissions.other[0]
        $scope.wfGroupPerm = $scope.workFile.permissions.other[0]   
        $scope.subview = 'edit'; 
    }
    /**
     Persist the changes to a workfile made in the editing page
    **/
    $scope.updateWorkFile = function(){
        $scope.workFile.$update({id:$scope.workFile.id},function(){
            $scope.successMessage = "Successfully Updated WorkFile " + $scope.workFile.id;
            var kkk = 32;
            var ggg = 20;
        });
    }
    $scope.popupFromDate = {
        opened: false
    };
    $scope.popupToDate = {
        opened: false
    };
    $scope.openFromDate = function() {
        $scope.popupFromDate.opened = true;
    };
    $scope.openToDate = function() {
        $scope.popupToDate.opened = true;
    };
     /**
      Clears both the error and success
      messages from $scope
    */
    $scope.clearMessages = function(){
        $scope.errorMessage = null;
        $scope.successMessage = null;
    }
    $scope.searchWorkFiles = function(){
        $scope.doneSearching = false;
        $scope.clearMessages()
        var queryParams = {}
        if($scope.bsObj.workFileID){
            WorkFile.queryOne({id:$scope.bsObj.workFileID},function(wfile){
                // need to make an array out of the single wf for the grid
                wfarray = [wfile]
                $scope.gridOptions.data = wfarray;
                $scope.doneSearching = true;
            },function(error){
                $scope.gridOptions.data = [];
            })
            return;    
        }
        queryParams._start = (paginationOptions.pageNumber-1) * paginationOptions.pageSize;
        queryParams._count = paginationOptions.pageSize;
        if($scope.bsObj.workFileHash){
            queryParams.hash = $scope.bsObj.workFileHash;
        }
        if($scope.bsObj.selectedUser && $scope.bsObj.selectedUser.username != 'Any User'){
            queryParams.creator = $scope.bsObj.selectedUser.username;
        }
        if($scope.bsObj.selectedGroup && $scope.bsObj.selectedGroup.name != 'Any Group'){
            queryParams.group = $scope.bsObj.selectedGroup;
        }
        if($scope.bsObj.orderBy){
            queryParams._orderBy=$scope.bsObj.orderBy;
        }
        if($scope.toDate){
            queryParams.toDate = $filter('date')($scope.toDate,"yyyy-MM-dd");
        }
        if($scope.fromDate){
            queryParams.fromDate = $filter('date')($scope.fromDate,"yyyy-MM-dd");
        }
        WorkFile.query(queryParams,function(wfiles){
            queryParams._justCount='true';
            WorkFile.queryOne(queryParams,function(fileCount){
                $scope.gridOptions.data = wfiles;
                $scope.queryFileCount = fileCount.work_file_count;
                $scope.doneSearching = true;    
            });
        })
    }
    $scope.selectedWorkFile = {};
    $scope.gridOptions.onRegisterApi = function( gridApi ) {
            $scope.gridApi = gridApi;
            //$scope.gridApi.grid.registerRowsProcessor( $scope.singleFilter, 200 );
            //loadWorkFiles();
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                var msg = 'row selected ' + row.isSelected;
                $scope.selectedWorkFile = row.entity;
                $scope.downloadLink = '/hive/v2/WorkFileContents/' + 
                    $scope.selectedWorkFile.id + "/" +
                    $scope.selectedWorkFile.originalName
                
            });
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                paginationOptions.pageNumber = newPage;
                paginationOptions.pageSize = pageSize;
                $scope.searchWorkFiles();
                
            });
            //needs to be called to have rows selectable
            $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.OPTIONS);
    };
    $scope.loadUsersAndGroups();
    //GridService.initGrid($scope, $sortService, WorkFile, $scope.selectedWorkFiles, columnDefs);

}])