var jobRunsController = angular.module('geneHive.JobRunsController', []);

jobRunsController.controller('JobRunsCtrl', ['JobRun', '$scope','$http','$sortService','GridService', 
  function(JobRun,$scope,$http,$sortService,GridService) {
    $scope.selectedJobRuns = [];
    $scope.isCollapsed = true;
    // default to the listing view
    $scope.subview = 'list';

    $scope.getInclude = function(){
      if ($scope.subview == 'list'){
          return 'partials/jobRuns.html'
      }else{
        return 'partials/jobRunDetails.html'
      }
    }
    $scope.showJobRuns = function(){
      $scope.subview ='list';
    }
    $scope.filterOptions = {
      filterText: ''
    };

    var showJobRun = function(jobRun){

      // Creation Date                                                                                     
      // Start Date                                                                                        
      // Stop Date                                                                                         
      // Input Files                                                                                       
      // Input Params                                                                                      
      // Output Files                                                                                      
      // STD out                                                                                           
      // STE err                                                                                           
      // Images 
      var jrun = {};
      jrun.id = jobRun.id;
      jrun.creationDate = jobRun.creationDatetime;
      jrun.startDate = jobRun.runDatetime;
      jrun.stopDate = jobRun.stopDatetime;
      jrun.inputFiles = [];
      jrun.inputParams = [];
      jrun.outputImages = [];
      jrun.outputFiles = [];
      angular.forEach(jobRun.inputTypes,function(val,key){
        var jobParamName = key; 
        var jobParamValue = jobRun.inputs[key];
        if(val.type == 'file'){
          // if its a file, append:
          //the file type
          //the sys ID of the file 
          jrun.inputFiles.push({'inputParamName':jobParamName,'fileType':val.fileType,'systemID':jobParamValue});
        }
        jrun.inputParams.push({'inputParamName':jobParamName,'inputParamValue':jobParamValue,'inputParamType':val.type});
        
      })// end input types

      angular.forEach(jobRun.outputTypes,function(val,key){
        var outputName = key;
        var outputValue = jobRun.outputs[key]
        var token = jobRun.outputTokens[outputName]
        // they should all be files but lets check
        if(val.type == 'file'){
          jrun.fileSize = bytesToSize(outputValue.length)
          if(val.fileType == 'JPG'){
            var url = '/GeneHive/api/v2/WorkFileContents/' + outputValue[0] + "/" + outputName + "?token" + token 
            jrun.outputImages.push({'outfileURL':url})
          }
          var downloadLink = '/GeneHive/api/v2/WorkFileContents/' + outputValue[0] + "/" + outputName + "?token" + token
          jrun.outputFiles.push({'systemID':outputValue,'fileType':val.fileType,'outputName':outputName,'token':token,'link':downloadLink})
        }
      })// end output types
      jrun.consoleOutput = jobRun.consoleOutput;
      jrun.consoleError = jobRun.consoleError;
      jrun.trashed = jobRun.trashed;
      jrun.children = jobRun.children;
      $scope.jrun = jrun;
    }
    	
    var dateSort=function(x,y) {
	   var dx=Date.parse(x)
	   var dy=Date.parse(y)
	   if(dx<dy) return -1;
	   if(dy<dx) return 1;
	   return 0;
    };
    var columnDefs=[
      {field:'id',displayName:'Details',cellTemplate:'<div class="ngCellText"><a ng-click="showJobRunDetails(row.getProperty(col.field))">view</a></div> '},
	    {field:'id', displayName:'ID',width: 60},
      {field:"inputs.name[0]", displayName:'Name'},
      {field:'creator', displayName:'Creator'},
      {field:'jobType', displayName:'Job Type'},
      {field:'executionLocation', displayName:'Execution Location'},
      {field:'runDatetime',displayName:'Run Date', sortFn: dateSort },
      {field:'status',displayName:'Status',cellTemplate: '<div ng-class="{green: row.getProperty(col.field) ==\'COMPLETE\',red: row.getProperty(col.field) ==\'FAILED\',salmon: row.getProperty(col.field) ==\'ABORTED\'}"><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>'}

    ];
    GridService.initGrid($scope, $sortService, JobRun, $scope.selectedJobRuns, columnDefs);

    $scope.$watch('selectedJobRuns', function(newValue, oldValue){
    // only make the call if selectedJobRuns has a length of at least 1
    if ($scope.selectedJobRuns.length ) {
        showJobRun(newValue[0])
    }   
    },true);
    $scope.showJobRunDetails = function(jobRunId){
      // its kinda gross to depend on this
      var jobRuns = $scope.cachedServerData.filter(
        function(jr){
          return (jr.id === jobRunId)
        }
      )
      $scope.subview = 'detail';
      showJobRun(jobRuns[0]);
    }


}]);