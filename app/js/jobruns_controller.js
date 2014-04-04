var jobRunsController = angular.module('geneHive.JobRunsController', []);

jobRunsController.controller('JobRunsCtrl', ['JobRun', '$scope','$http','$sortService','GridService', 
  function(JobRun,$scope,$http,$sortService,GridService) {
    $scope.selectedJobRuns = [];
    $scope.isCollapsed = true;
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
        if(val.type=='string'){
          // if a string, its a simple param name value set
          jrun.inputParams.push({'inputParamName':jobParamName,'inputParamValue':jobParamValue});
        }
      })// end input types
      angular.forEach(jobRun.outputTypes,function(val,key){
        var outputName = key;
        // they should all be files but lets check
        if(val.type == 'file'){
          if(val.fileType == 'JPG'){
            var url = 'www.something' + jobRun.outputs[key]
            jrun.outputImages.push({'outfileURL':url})
          }
          jrun.outputFiles.push({'systemID':'x','fileType':'x','outputName':'x','temp':'x','outfileURL':'c','jobRunId':'x'})

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
	    {field:'id', displayName:'ID',width: 60},
      {field:"inputs.name[0]", displayName:'Name'},
      {field:'creator', displayName:'Creator'},
      {field:'jobType', displayName:'Job Type'},
      {field:'runDatetime',displayName:'Run Date', sortFn: dateSort },
      {field:'status',displayName:'Status',cellTemplate: '<div ng-class="{green: row.getProperty(col.field) ==\'COMPLETE\'}"><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>'}

    ];
    GridService.initGrid($scope, $sortService, JobRun, $scope.selectedJobRuns, columnDefs);

    $scope.$watch('selectedJobRuns', function(newValue, oldValue){
    // only make the call if selectedJobRuns has a length of at least 1
    if ($scope.selectedJobRuns.length ) {
        showJobRun(newValue[0])
    }   
    },true);


}]);