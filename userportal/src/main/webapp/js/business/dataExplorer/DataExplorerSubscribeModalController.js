appControllers.controller('DataExplorerSubscribeModalCtrl', [ '$scope', '$routeParams','storeAPIservice', '$location', '$modalInstance', 'info', 'dataset',
                                                          function($scope, $routeParams, storeAPIservice, $location, $modalInstance, info, dataset ) {
     	console.log('DataExplorerSubscribeModalCtrl  dataset', dataset);

     	
     	$scope.cancel = function() {
     		$modalInstance.dismiss();
     	};

     	$scope.subscribe = function() {
     		$modalInstance.dismiss();
     	};

     	
    	$scope.applicationList = null;
    	var subscriptionList = [];
    	$scope.editedDescriptions =  [];
    	
    	
    	var isApplicationSubscribed  = function(appName){
    		var found = false;
    		for (var subscriptionIndex = 0; subscriptionIndex < subscriptionList.length; subscriptionIndex++) {
    			if(subscriptionList[subscriptionIndex].name == appName){
    				found = true;
    				break;
    			}
			}
    		return found;
    	};

    	var loadApplications  = function(){
    		storeAPIservice.getApplications().success(function(response) {
	    		console.log("response",response);
	    		$scope.applicationList = response.applications;
	        	storeAPIservice.getSubscriptions().success(function(response) {
	        		console.log("getSubscriptions response",response);
	        		subscriptionList = response.subscriptions;
	        		if($scope.applicationList!=null){
	        			for (var appIndex = 0; appIndex < $scope.applicationList.length; appIndex++) {
							$scope.applicationList[appIndex].isBusy = false;
							$scope.applicationList[appIndex].isEditing = false;
							$scope.applicationList[appIndex].isSubscribed = isApplicationSubscribed($scope.applicationList[appIndex].name);
							$scope.editedDescriptions[appIndex] = $scope.applicationList[appIndex].description;
							
	        			}
	        		}
	        	});
	    	});
    	};
    	
    	
    	loadApplications();
    	
    	 
    	
    	
    	
    	
    	$scope.startEditApplication  = function(index){
    		$scope.applicationList[index].isEditing = true;
    	};

    	$scope.saveEditApplication  = function(index){
    		$scope.applicationList[index].description = $scope.editedDescriptions[index];
    		console.log("saveEditApplication: editedApplication",$scope.applicationList[index]);
    		$scope.applicationList[index].isEditing = false;
    	};

    	$scope.cancelEditApplication  = function(index){
    		$scope.editedDescriptions[index] = $scope.applicationList[index].description;
    		$scope.applicationList[index].isEditing = false;
    	};
    	
    	$scope.unsubscribeApplication = function(index){
    		$scope.applicationList[index].isSubscribed = false;
    	};

    	$scope.subscribeApplication = function(index){
    		$scope.applicationList[index].isSubscribed = true;
    	};

    	
    	
     }]);


translations_it["APPLICATIONS_NAME"] = "Nome";
translations_it["APPLICATIONS_DESCRIPTION"] = "Descrizione";

translations_it["DATA_EXPLORER_SUBSCRIBE_NEW_APPLICATION_TITLE"] = "Crea nuova applicazione";
translations_it["DATA_EXPLORER_SUBSCRIBE_ADD_SUBSCRIPTION"] = "Sottoscrivi";
translations_it["DATA_EXPLORER_SUBSCRIBE_REMOVE_SUBSCRIPTION"] = "Annulla Sottoscrizione";
