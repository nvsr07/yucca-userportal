appControllers.controller('DataExplorerSubscribeModalCtrl', [ '$scope', '$routeParams','storeAPIservice', '$location', '$modalInstance', 'info', 
                                                          function($scope, $routeParams, storeAPIservice, $location, $modalInstance, info ) {
     	console.log('>>>>>>>> DataExplorerSubscribeModalController >>>>>>>> $scope', $scope);
     	console.log('>>>>>>>> DataExplorerSubscribeModalController >>>>>>>> $routeParams', $routeParams);
     	console.log('>>>>>>>> DataExplorerSubscribeModalController >>>>>>>> $location', $location);
     	console.log('>>>>>>>> DataExplorerSubscribeModalController >>>>>>>> storeAPIservice', storeAPIservice);
     	console.log('>>>>>>>> DataExplorerSubscribeModalController >>>>>>>> $modalInstance', $modalInstance);
     	console.log('>>>>>>>> DataExplorerSubscribeModalController >>>>>>>> info', info);
     	
     	$scope.tenantCode = $routeParams.tenant_code;
     	
     	$scope.cancel = function() {
     		$modalInstance.dismiss();
     	};

     	$scope.subscribe = function() {
     		$modalInstance.dismiss();
     	};

     	
    	$scope.applicationList = null;
    	$scope.subscriptionList = null;

    	storeAPIservice.getApplications().success(function(response) {
    		console.log("response",response);
    		$scope.applicationList = response.applications;

    	});

    	storeAPIservice.getSubscriptions().success(function(response) {
    		console.log("response",response);
    		$scope.subscriptionList = response.subscriptions;

    	});
    	
    	
     }]);

