var workFilesController = angular.module('geneHive.WorkFilesController', []);

workFilesController.controller('WorkFilesAcessCrtl',['$scope','$http','wfId','$uibModalInstance','uiGridConstants',
        function modalController($scope,$http,wfId,$uibModalInstance,uiGridConstants){
    $scope.getHistory = function(){
        $scope.history_loaded = false;
        $scope.wfId = wfId;
        $scope.selectedRecord = {};
        var url = '/hive/v2/WorkFileProperties/history/' + wfId;   
        $http.get(url).
            then(function(response) {
                // gotta map this to the array becausee
                // of angular's fussy date handling
                function changeDate(wf) {
                    wout = wf;
                    // this is needed by angular date filters
                    wout.timestamp = new Date(wf.timestamp)
                    return wout;
                }
                $scope.wfAccessGridOptions.data = response.data.map(changeDate);
                $scope.history_loaded = true;       
                },
                function(response){
                    $scope.errorMessage=response;
                }
            );  
   };
   $scope.ok = function () {
        $uibModalInstance.close();
    };        
    var columnDefs= [
        {field: "timestamp",width: '40%',displayName:'Time',type: 'date', cellFilter: 'date:"M/d/yy h:mm:ss a"' },
        {field:"remote_user_name",displayName:"remote name",width:'20%'},
        {field: "remote_address",displayName:"remote addr",width:'20%'},
        {field: "response_status_code",displayName:"resp code",width:'20%'}
    ];        
    $scope.wfAccessGridOptions = {
        enableColumnResize: true,
        columnDefs: columnDefs,
        enableGridMenu: false,
        enableRowSelection: true,
        enableFullRowSelection: true,
        multiSelect: false,
        noUnselect: true,
        enableFiltering: true,
        onRegisterApi: function(gridApi){
            $scope.gridApi = gridApi;
        }   
    
    }; 
    $scope.wfAccessGridOptions.onRegisterApi = function( gridApi ) {
        $scope.gridApi = gridApi; 
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
            var msg = 'row selected ' + row.isSelected;
            $scope.selectedRecord = row.entity;    
            });
        //needs to be called to have rows selectable
        $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.OPTIONS);     
    }
    $scope.getHistory();
    }
    ])

workFilesController.controller('WorkFilesCtrl', ['$scope','$http','$filter','$timeout','Upload','User','WorkFile','UserGroup','uiGridConstants','$uibModal',
					 function($scope,$http,$filter,$timeout,Upload,User,WorkFile,UserGroup,uiGridConstants,$uibModal) {


    // default to the listing view
    $scope.subview = 'list';   
                    
    $scope.getInclude = function(){
      if ($scope.subview == 'list'){
          return 'partials/workFiles.html'
      }else if($scope.subview == 'upload'){
        return 'partials/workFileUpload.html'
      }{
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
        {field: "creationDatetime",type: 'date', cellFilter: 'date:"M/d/yy h:mm:ss a"' },
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
    $scope.showMainListing = function(){
        $scope.subview = "list";
        loadWorkFiles();
    }
    $scope.addWorkFile = function(){
        $scope.workFile = {};
        $scope.subview ='upload';
    }
    var loadWorkFiles = function(){
        WorkFile.query(function(wfiles){
            $scope.gridOptions.data = wfiles;
        })
    };
    $scope.showWorkFileHistory = function(){
        
        modalInstance = $uibModal.open({
                    templateUrl: 'partials/workFileAccessModal.html',
                    controller: 'WorkFilesAcessCrtl',
                    resolve: {
                        wfId : function(){
                            return $scope.selectedWorkFile.id; 
                        }
                    }
                    });
    }
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
    $scope.uploadWorkFile = function(file) {
    file.upload = Upload.upload({
        url: '/hive/v2/WorkFiles?originalName='+ $scope.workFile.originalName
            + '&storage=' + $scope.workFile.storage 
            + '&group=' + $scope.workFile.group,
        headers : {
            'Content-Type': 'text/plain'
        },      
        data: {
                file: file
            },
        });
    file.upload.then(function (response) {
         $timeout(function () {
            file.result = response.data;
            });
        }, function (response) {
        if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
    }
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
        //looking for a file by ID
        if($scope.bsObj.workFileID && $scope.bsObj.workFileID.length > 0){
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
        if($scope.bsObj.toDate && $scope.bsObj.fromDate){
            queryParams._toCreationDatetime = $filter('date')($scope.bsObj.toDate,"yyyy-MM-dd");
        }
        if($scope.bsObj.toDate && $scope.bsObj.fromDate){
            queryParams._fromCreationDatetime = $filter('date')($scope.bsObj.fromDate,"yyyy-MM-dd");
        }
        if($scope.bsObj.originalName){
            queryParams.originalName=$scope.bsObj.originalName;
        }
        WorkFile.query(queryParams,function(wfiles){
            queryParams._justCount='true';
            WorkFile.queryOne(queryParams,function(fileCount){
                function changeDate(wf) {
                    wout = wf;
                    // this is needed by angular date filters
                    wout.creationDatetime = new Date(wf.creationDatetime)
                    return wout;
                }
                $scope.gridOptions.data = wfiles.map(changeDate);
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