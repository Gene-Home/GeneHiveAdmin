var storageController = angular.module('geneHive.StorageController', []);

storageController.controller('StorageConfCtrl', ['$scope','$http', '$modal','StorageLocation','uiGridConstants','UserGroup',
					 function($scope,$http,$modal,StorageLocation,uiGridConstants,UserGroup) {

	    // default to the listing view
    $scope.subview = 'list';
    $scope.getInclude = function(){
      if ($scope.subview == 'list'){
          return 'partials/storageConfList.html'
      }else if ($scope.subview == 'newS3'){
        return 'partials/storageConfNewS3.html'
      }else if ($scope.subview == 'newFS'){
        return 'partials/storageConfFS.html'
      }
    }
    $scope.listStorageLocations = function(){
      $scope.subview ='list';
    }
    				 	
	$scope.localLocs = [];
	$scope.s3Locs = [];
    // i know its repeating them but its ok :)
    $scope.locs = [];

	$scope.loadLocations = function(){
        $scope.localLocs = [];
        $scope.s3Locs = [];
        $scope.locs = [];
        StorageLocation.query(function(locs){
        	for (i = 0; i<locs.length; i++){
                // make sure we have an index so we can find them easily
                locs[i].idx = i;
        		if(locs[i].protocol=='fs'){
        			$scope.localLocs.push(locs[i]);
        		}
        		if(locs[i].protocol=='s3'){
        			$scope.s3Locs.push(locs[i]);
        		}
                //need to add this for the UI
                var hasGrp = locs[i].permissions.group.lastIndexOf("U") != -1;
                var hasOther = locs[i].permissions.other.lastIndexOf("U") != -1;
                if(!hasGrp && !hasOther){ locs[i].perm = "none"};
                if(hasOther){locs[i].perm = "other"};
                if(hasGrp && !hasOther){locs[i].perm = "group"}
            }
            $scope.locs = locs;

        })
    };
    $scope.deleteLocation = function (locIdex) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/storageConfDeleteModal.html',
            controller: 'StorageConfModalController',
            resolve: {
                locationName: function(){
                    return $scope.locs[locIdex].name;
            }
            }
        });
        modalInstance.result.then(function (response) {
            $scope.loadLocations();
            console.log(response);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    $scope.editLocation = function(locIdex){
        // editing the currentUser
        // need to copy first in case of cancel/rollback
        $scope.newLoc = angular.copy($scope.locs[locIdex]);
        //sorry gotta do this for ui-select
        $scope.newLoc.group = {name:$scope.locs[locIdex].group}
        $scope.successMessage = undefined;
        $scope.errorMessage = undefined;
        $scope.action = 'editing';
        if($scope.newLoc.protocol == "s3")
            $scope.subview = 'newS3';
        if($scope.newLoc.protocol == "fs")
            $scope.subview = 'newFS';
    
        // yeah, i  know :(
        $scope.loadUserGroups();
    };
    $scope.addS3Location = function(){
    	$scope.newLoc = {};
        $scope.newLoc.protocol="s3";
    	$scope.newLoc.permissions = {"group":[],"other":[]};
    	// set the group to default - cheap i know
    	$scope.newLoc.group = {"name":"Default"}
        $scope.successMessage = undefined;
        $scope.errorMessage = undefined;
        $scope.action = 'creating';
        $scope.subview = 'newS3';
        // yeah, i  know :(
        $scope.loadUserGroups();
    };
    $scope.addFSLocation = function(){
        $scope.newLoc = {};
        $scope.newLoc.protocol="fs";
        $scope.newLoc.permissions = {"group":[],"other":[]};
        // set the group to default - cheap i know
        $scope.newLoc.group = {"name":"Default"}
        $scope.successMessage = undefined;
        $scope.errorMessage = undefined;
        $scope.action = 'creating';
        $scope.subview = 'newFS';
        // yeah, i  know :(
        $scope.loadUserGroups();  
    }
    $scope.loadUserGroups = function(){
        UserGroup.query().$promise.then(
            function(groups){
            	$scope.userGroups = [{"name":"Default"}]
                $scope.userGroups = $scope.userGroups.concat(groups);
            }
        )
    };

    $scope.saveLocation = function(){
        // so we can put a spinner on the button or something
        $scope.saving = true;
    	// lets hope there is no actaul group named Default!!
    	if ($scope.newLoc.group.name ==  "Default"){
    		$scope.newLoc.group = undefined;
    	}else{
            // need to turn the group obj in to a string for the api
            $scope.newLoc.group = $scope.newLoc.group.name
        }
        if($scope.newLoc.perm == "none"){
            // no group - only super user
        }
        if($scope.newLoc.perm == "group"){
            // anyone in the group may use
            $scope.newLoc.permissions.group = ["U"];
        }
    	if($scope.newLoc.perm == "other"){
            // just for completeness - lets add the group too
            $scope.newLoc.permissions.group = ["U"];
            $scope.newLoc.permissions.other = ["U"];		
    			
    	}
    	
    	
        if($scope.action == 'creating'){	
            StorageLocation.save({},$scope.newLoc).$promise.then(
                function(location){
                    $scope.errorMessage = null;
                    $scope.successMessage = "Successfully Created Location: " + location.name;
                    $scope.newLoc = angular.copy(location,$scope.newLoc);
                    $scope.saving = false;
                    // seriously man ... chain these things
                    $scope.listStorageLocations();
                    $scope.loadLocations()
                },
                function(message){
                    $scope.errorMessage = "Error Creating Location: " + message.data;
                    $scope.saving = false;
                }
            )
        };
        if($scope.action == 'editing'){
          StorageLocation.update({wfsName:$scope.newLoc.name},$scope.newLoc).$promise.then(
                function(location){
                    $scope.errorMessage = null;
                    $scope.successMessage = "Successfully Updated Location: " + location.name;
                    $scope.newLoc = angular.copy(location,$scope.newLoc);
                    $scope.saving = false;
                    // seriously man ... chain these things
                    $scope.listStorageLocations();
                    $scope.loadLocations()
                },
                function(message){
                    $scope.errorMessage = "Error Updating Location: " + message.data;
                    $scope.saving = false;
                }
            )  
        };
        
    }//end saveLocation 
    $scope.loadLocations();
}])