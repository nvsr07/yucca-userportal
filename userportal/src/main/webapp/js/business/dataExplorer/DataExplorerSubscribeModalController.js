appControllers.controller('DataExplorerSubscribeModalCtrl', [ '$scope', '$routeParams','storeAPIservice', '$location', '$modalInstance', 'info', 'dataset',
                                                          function($scope, $routeParams, storeAPIservice, $location, $modalInstance, info, dataset ) {
     	console.log('DataExplorerSubscribeModalCtrl  dataset', dataset);
     	$scope.dataset = dataset;
     	
     	$scope.updateMessage = null;
     	$scope.errorMessage = null;
		$scope.apiName = null;
		$scope.apiVersion = null;
		$scope.apiProvider = null;

     	
     	$scope.updating = false;
     	
		if($scope.dataset.API!=null){
			var apiUrl = $scope.dataset.API;
			var params = Helpers.util.getQueryParams(apiUrl.substring(apiUrl.lastIndexOf("?")));
			$scope.apiName = params.name;
			$scope.apiVersion = params.version;
			$scope.apiProvider = params.provider;
		}

     	
     	$scope.cancel = function() {
     		$modalInstance.dismiss();
     	};

     	$scope.subscribe = function() {
     		$modalInstance.dismiss();
     	};

     	
    	$scope.applicationList = null;
    	var subscriptionList = [];
    	$scope.editedDescriptions =  [];
    	
    	
    	var isApplicationSubscribed  = function(appName, apiName, apiVersion, apiProvider){
    		var found = false;
    		for (var subscriptionIndex = 0; subscriptionIndex < subscriptionList.length; subscriptionIndex++) {
    			if(subscriptionList[subscriptionIndex].name == appName){
    				for (var subscriptionAPIIndex = 0;subscriptionAPIIndex< subscriptionList[subscriptionIndex].subscriptions.length;subscriptionAPIIndex++)
   					{
    					if (
    							subscriptionList[subscriptionIndex].subscriptions[subscriptionAPIIndex].name == apiName &&
    							subscriptionList[subscriptionIndex].subscriptions[subscriptionAPIIndex].version == apiVersion &&
    							subscriptionList[subscriptionIndex].subscriptions[subscriptionAPIIndex].provider == apiProvider
    						)
    					{
    						found = true;
    					}
   					}
    				
    				break;
    			}
			}
    		return found;
    	};

    	var loadApplications  = function(){
    		$scope.updating = true;
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
							$scope.applicationList[appIndex].isSubscribed = isApplicationSubscribed($scope.applicationList[appIndex].name, $scope.apiName, $scope.apiVersion, $scope.apiProvider);
							$scope.editedDescriptions[appIndex] = $scope.applicationList[appIndex].description;
							
	        			}
	        		}
	        		$scope.updating = false;
	        	}).error(function(response){
		    		console.error("loadApplications: error", response);
		    		$scope.errorMessage = "DATA_EXPLORER_SUBSCRIBE_ERROR_LOAD_SUBSCRIPTIONS";
	        		$scope.updating = false;
		    	});
	    	}).error(function(response){
	    		console.error("loadApplications: error", response);
	    		$scope.errorMessage = "DATA_EXPLORER_SUBSCRIBE_ERROR_LOAD_APP";
        		$scope.updating = false;
	    	});
    	};
    	
    	
    	loadApplications();
    	
    	 
    	
    	$scope.clearMessages =  function(){
         	$scope.updateMessage = null;
         	$scope.errorMessage = null;
    	};
    	
    	
    	$scope.startEditApplication  = function(index){
         	$scope.updateMessage = null;
         	$scope.errorMessage = null;
    		$scope.applicationList[index].isEditing = true;
    	};

    	$scope.saveEditApplication  = function(index){
         	$scope.updateMessage = null;
         	$scope.errorMessage = null;
         	$scope.applicationList[index].description = $scope.editedDescriptions[index];
    		console.log("saveEditApplication: editedApplication",$scope.applicationList[index]);

    		$scope.updating = true;
    		
    		$scope.applicationList[index].isBusy = true;
    		storeAPIservice.updateApplication($scope.applicationList[index]).success(function(response) {
    	     	$scope.updateMessage = "DATA_EXPLORER_SUBSCRIBE_OK_UPDATE_APP";
    			$scope.applicationList[index].isBusy = false;
    			loadApplications();
    		}).error(function(response) {
    			console.log("subscribeApplication: Error", response);
    			$scope.errorMessage = "DATA_EXPLORER_SUBSCRIBE_ERROR_UPDATE_APP";
    			loadApplications();
    			$scope.applicationList[index].isBusy = false;
    		});

    		$scope.applicationList[index].isEditing = false;
    	};

    	
    	$scope.cancelEditApplication  = function(index){
         	$scope.updateMessage = null;
         	$scope.errorMessage = null;
    		$scope.editedDescriptions[index] = $scope.applicationList[index].description;
    		$scope.applicationList[index].isEditing = false;
    	};
    	
    	$scope.createApplication  = function(){
         	$scope.updateMessage = null;
         	$scope.errorMessage = null;
    		var newApplication = {"name":$scope.newApplicationName, "description": $scope.newApplicationDescription};
    		$scope.updating = true;
    		storeAPIservice.createApplication(newApplication).success(function(response) {
    	     	$scope.updateMessage = "DATA_EXPLORER_SUBSCRIBE_OK_CREATE_APP";
    			loadApplications();
	   			$scope.newApplicationName = null;
				$scope.newApplicationDescription = null;
    		}).error(function(response) {
    			console.log("subscribeApplication: Error", response);
    			$scope.errorMessage = "DATA_EXPLORER_SUBSCRIBE_ERROR_CREATE_APP";
    			loadApplications();
    		});

    	};
    	
    	$scope.unsubscribeApplication = function(index){
         	$scope.updateMessage = null;
         	$scope.errorMessage = null;
    		var app = $scope.applicationList[index];
    		
    		$scope.applicationList[index].isBusy = true;
    		$scope.updating = true;
    		storeAPIservice.removeSubscription($scope.apiName, $scope.apiVersion, $scope.apiProvider, app.id).success(function(response) {
    	     	$scope.updateMessage = "DATA_EXPLORER_SUBSCRIBE_OK_UNSUBSCRIBE";
    			$scope.applicationList[index].isBusy = false;
    			loadApplications();
    		}).error(function(response) {
    			console.log("subscribeApplication: Error", response);
    			$scope.errorMessage = "DATA_EXPLORER_SUBSCRIBE_ERROR_UNSUBSCRIBE";
    			loadApplications();
    			$scope.applicationList[index].isBusy = false;
    		});
    	};

    	$scope.subscribeApplication = function(index){
         	$scope.updateMessage = null;
         	$scope.errorMessage = null;
    		var app = $scope.applicationList[index];

    		$scope.updating = true;
    		$scope.applicationList[index].isBusy = true;
    		storeAPIservice.addSubscription($scope.apiName, $scope.apiVersion, $scope.apiProvider, app.id).success(function(response) {
    			$scope.applicationList[index].isBusy = false;
    	     	$scope.updateMessage = "DATA_EXPLORER_SUBSCRIBE_OK_SUBSCRIBE";
    			loadApplications();
    		}).error(function(response) {
    			console.log("subscribeApplication: Error", response);
    			$scope.errorMessage = "DATA_EXPLORER_SUBSCRIBE_ERROR_SUBSCRIBE";
    			loadApplications();
    			$scope.applicationList[index].isBusy = false;
    		});
    	};
    	
     }]);

translations_it["CLOSE"] = "Chiudi";
translations_it["WAIT"] = "Attendere...";

//translations_it["DATA_EXPLORER_SUBSCRIBE_MODAL_TITLE"] = "Sottoscrivi API";
//translations_it["DATA_EXPLORER_SUBSCRIBE_MODAL_SUBTITLE"] = "Scegli un'applicazione e sottoscrivi le API";
//
//
//translations_it["APPLICATIONS_NAME"] = "Nome";
//translations_it["APPLICATIONS_DESCRIPTION"] = "Descrizione";
//
//translations_it["DATA_EXPLORER_APPLICATIONS_LIST_TITLE"] = "Applicazioni";
//
//translations_it["DATA_EXPLORER_SUBSCRIBE_NEW_APPLICATION_TITLE"] = "Crea nuova applicazione";
//translations_it["DATA_EXPLORER_SUBSCRIBE_ADD_SUBSCRIPTION"] = "Sottoscrivi";
//translations_it["DATA_EXPLORER_SUBSCRIBE_REMOVE_SUBSCRIPTION"] = "Annulla Sottoscrizione";
//
//translations_it["DATA_EXPLORER_SUBSCRIBE_ERROR_LOAD_APP"] = "Caricamento applicazioni fallito";
//translations_it["DATA_EXPLORER_SUBSCRIBE_ERROR_LOAD_SUBSCRIPTIONS"] = "Caricamento sottoscrizioni fallito";
//translations_it["DATA_EXPLORER_SUBSCRIBE_OK_SUBSCRIBE"] = "Subscribe effettuata con successo";
//translations_it["DATA_EXPLORER_SUBSCRIBE_ERROR_SUBSCRIBE"] = "Subscribe fallita";
//translations_it["DATA_EXPLORER_SUBSCRIBE_OK_UNSUBSCRIBE"] = "Unsubscribe effettuata con successo";
//translations_it["DATA_EXPLORER_SUBSCRIBE_ERROR_UNSUBSCRIBE"] = "Unsubscribe fallita";
//translations_it["DATA_EXPLORER_SUBSCRIBE_OK_UPDATE_APP"] = "Applicazione aggiornata";
//translations_it["DATA_EXPLORER_SUBSCRIBE_ERROR_UPDATE_APP"] = "Aggiornamento applicazione fallito";
//translations_it["DATA_EXPLORER_SUBSCRIBE_OK_CREATE_APP"] = "Applicazione creata";
//translations_it["DATA_EXPLORER_SUBSCRIBE_OK_CREATE_APP"] = "Creazione applicazione fallito";
//
//translations_it["DATA_EXPLORER_SUBSCRIBE_CREATE_APP_BTN"] = "Crea applicazione";
//
//translations_it["DATA_EXPLORER_SUBSCRIBE_GO_TO_SUBSCRIPTIONS"] = "Vai alle tue sottoscrizioni";

translations_en["APPLICATIONS_NAME"] = "Subscribe API";
translations_en["APPLICATIONS_DESCRIPTION"] = "Choose an application and subscribe API";





