/* Controllers */

//var appControllers = angular.module('userportal.controllers', []);

//appControllers.controller('DashboardCtrl', ['$scope', function($scope) {}]);


appControllers.controller('DashboardMenuCtrl', [ '$scope', "$route", 'fabricAPIservice', function($scope, $route, fabricAPIservice) {
	$scope.tenantsList = null;
	
	fabricAPIservice.getTenants().success(function(response) {
		console.debug("response", response.tenants);
		$scope.tenantsList = response.tenants.tenant;		
	});
	
	
	$scope.currentPanel  = 'main';
	if($route.current.templateUrl.indexOf("streams")>-1)
		$scope.currentPanel  = 'streams';
	else if($route.current.templateUrl.indexOf("error-log")>-1)
		$scope.currentPanel  = 'error_log';
} ]);



appControllers.controller('DashboardHomeCtrl', [ '$scope', "$route", 'fabricAPIservice', function($scope, $route, fabricAPIservice) {
	
	$scope.dashboard = $route.current.params.dashboard;
	$scope.tenantWithNoDashboardError = null;
	if(!$scope.dashboard)
		$scope.dashboard = "example";
	
	fabricAPIservice.getTenants().success(function(response) {
		console.debug("response", response.tenants);
		$scope.tenantsList = response.tenants.tenant;		
	
	});
	
	

	freeboard.initialize(false);
	$.ajax({
	    url: "js/dashboard/freeboard/"+$scope.dashboard+"-dashboard.json",
	    dataType: 'json',
	    success: function(json) {
		    console.log(json); 
		    freeboard.loadDashboard(json, new function(){
			    	freeboard.showLoadingIndicator(false);
			    });
		    },
	    error: function(){
	    	$scope.tenantWithNoDashboardError = 'DASHBOARD_SECTION_TENANT_NO_DASHBOARD_ERROR';
	    }
	});

//	$.getJSON("js/dashboard/freeboard/"+$scope.dashboard+"-dashboard.json", function(json) {
//	    console.log(json); 
//	    freeboard.loadDashboard(json, new function(){
//	    	freeboard.showLoadingIndicator(false);
//	    });
//	});
	freeboard.showLoadingIndicator(false);

} ]);


appControllers.controller('DashboardCtrl', [ '$scope', 'fabricAPIservice', function($scope, fabricAPIservice, filterFilter) {
	$scope.streamsList = [];
	$scope.filteredStreamsList = [];
	$scope.tenantsFilter = null;

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.streamsList.length;
	$scope.predicate = '';

	fabricAPIservice.getStreams().success(function(response) {
		// Dig into the responde to get the relevant data
		$scope.streamsList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		for (var i = 0; i < $scope.streamsList.length; i++) {
			$scope.streamsList[i].statusIcon = Helpers.stream.statusIcon($scope.streamsList[i]);;
		}

		$scope.totalItems = $scope.streamsList.length;
	//	$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	});

	$scope.selectPage = function() {
		//$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	};

	$scope.searchTenantsFilter = function(stream) {
		var keyword = new RegExp($scope.tenantsFilter, 'i');
		return !$scope.tenantsFilter || keyword.test(stream.codiceTenant);
	};

	$scope.$watch('tenantsFilter', function(newTenant) {
		$scope.currentPage = 1;

		// $scope.filteredStreamsList = $filter('filter')($scope.streamsList,
		// $scope.tenant);
		$scope.totalItems = $scope.filteredStreamsList.length;
		console.log("newTenant", newTenant);
	});

} ]);

appControllers.controller('DashboardStreamCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'webSocketService', "$filter",
                                                   function($scope, $routeParams, fabricAPIservice, webSocketService, $filter) {
	$scope.stream = null;
	$scope.wsUrl = "";
	//fabricAPIservice.getStream($routeParams.id_stream).success(function(response) {
	fabricAPIservice.getStream($routeParams.tenant_code, $routeParams.virtualentity_code, $routeParams.stream_code).success(function(response) {
		$scope.stream = response.streams.stream;
		if($scope.stream.componenti == null)
			$scope.stream.componenti = new Object();
		$scope.stream.componenti.element = Helpers.util.initArrayZeroOneElements($scope.stream.componenti.element);

		$scope.wsUrl = Helpers.stream.wsOutputUrl($scope.stream);
		connectWS();
//		connectWSStatistic();
//		connectWSClientData();
//		connectWSClientError();
	});

	var totalError = 0;

	var maxNumWsStatisticMessages = 3;
	var maxNumWsErrorMessages = 2;
	$scope.wsStatisticMessages = [ [ "-", "-" ], [ "-", "-" ], [ "-", "-" ]];
	$scope.wsErrorMessages = [ [ "-", "-" ], [ "-", "-" ]];
	var maxNumStatisticData = 30;
	var counter = 0;
	//	$scope.wsStatisticData = [ { x : counter, y : 0 } ];
	//	for (counter = 1; counter < maxNumStatisticData; counter++)
	//		$scope.wsStatisticData.push({ x : counter, y : 0 });


	$scope.nvWsStatisticData = [{key: "Events", color: '#2980b9', values: []}, {key: "Errors",color: '#c0392b',  values: []}];
	for (counter = 1; counter < maxNumStatisticData; counter++){
		$scope.nvWsStatisticData[0]["values"].push([0,0]);
		$scope.nvWsStatisticData[1]["values"].push([0,0]);
	}

	
	var wsClient = webSocketService();
	var timeCounter = 0;
	
	// last message
	$scope.wsLastMessage = "";
	$scope.wsLastMessageToShow = "";


	var connectWS = function(){
		wsClient.connect(function(message) {
			console.debug("message", message);  // "/topic/ten1.flussoProva.stat"
			
			var wsStatUrl = Helpers.stream.wsStatUrl($scope.stream);
			console.debug("subscribe wsStatUrl ", wsStatUrl);

			$scope.wsUrl = Helpers.stream.wsOutputUrl($scope.stream);
			console.debug("subscribe wsUrl ", $scope.wsUrl);

			var wsErrorUrl = Helpers.stream.wsErrorUrl($scope.stream);
			console.debug("subscribe wsErrorUrl ", wsErrorUrl);

			wsClient.subscribe(wsStatUrl, statisticCallback);
			wsClient.subscribe($scope.wsUrl, dataCallback);
			wsClient.subscribe(wsErrorUrl, errorCallback);
			
		}, function() {
		}, '/');
	};
	
	function statisticCallback(message) {
		console.debug("message", message);
		counter++;
		console.debug("wsStatisticMessages", $scope.wsStatisticMessages);

		if ($scope.wsStatisticMessages.length >= maxNumWsStatisticMessages) 
			$scope.wsStatisticMessages.shift();
		if ($scope.wsErrorMessages.length >= maxNumWsErrorMessages) 
			$scope.wsErrorMessages.shift();
		//if ($scope.wsStatisticData.length > maxNumStatisticData) $scope.wsStatisticData.shift();

		if ($scope.nvWsStatisticData[0]["values"].length > maxNumStatisticData){
			$scope.nvWsStatisticData[0]["values"].shift();
			$scope.nvWsStatisticData[1]["values"].shift();
		}


		var numOfEvents = angular.fromJson(message.body).event.payloadData.numEventsLast30Sec;

		$scope.wsStatisticMessages.push([ $filter('date')(new Date(), "HH:mm:ss"), numOfEvents ]);
		$scope.wsErrorMessages.push([ $filter('date')(new Date(), "HH:mm:ss"), totalError]);

		$scope.nvWsStatisticData[0]["values"].push([timeCounter,numOfEvents]);
		$scope.nvWsStatisticData[1]["values"].push([timeCounter,totalError]);
		timeCounter +=2;

	};
	
	function dataCallback(message) {
		console.debug("data message", message);
		$scope.wsLastMessage = JSON.stringify(JSON.parse(message.body), null, "\t");
		console.debug("$scope.wsLastMessage", $scope.wsLastMessage);

		if ($scope.wsLastMessageToShow == "")
			$scope.wsLastMessageToShow = $scope.wsLastMessage;
	};
	
	
	function errorCallback(message) {
		console.debug("Error message", message);
		totalError++;
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/*
	
	$scope.wsClientStatistics = webSocketService();

	var timeCounter = 0;
	var connectWSStatistic = function(){
		$scope.wsClientStatistics.connect(function(message) {
			console.debug("message", message);  // "/topic/ten1.flussoProva.stat"
			var wsStatUrl = Helpers.stream.wsStatUrl($scope.stream);
			console.debug("subscribe wsStatUrl ", wsStatUrl);
			$scope.wsClientStatistics.subscribe(wsStatUrl, function(message) {
				console.debug("message", message);
				counter++;
				console.debug("wsStatisticMessages", $scope.wsStatisticMessages);

				if ($scope.wsStatisticMessages.length >= maxNumWsStatisticMessages) 
					$scope.wsStatisticMessages.shift();
				if ($scope.wsErrorMessages.length >= maxNumWsErrorMessages) 
					$scope.wsErrorMessages.shift();
				//if ($scope.wsStatisticData.length > maxNumStatisticData) $scope.wsStatisticData.shift();

				if ($scope.nvWsStatisticData[0]["values"].length > maxNumStatisticData){
					$scope.nvWsStatisticData[0]["values"].shift();
					$scope.nvWsStatisticData[1]["values"].shift();
				}


				var numOfEvents = angular.fromJson(message.body).event.payloadData.numEventsLast30Sec;

				$scope.wsStatisticMessages.push([ $filter('date')(new Date(), "HH:mm:ss"), numOfEvents ]);
				$scope.wsErrorMessages.push([ $filter('date')(new Date(), "HH:mm:ss"), totalError]);
				//$scope.wsStatisticData.push({ x : counter*2, y : numOfEvents });

				$scope.nvWsStatisticData[0]["values"].push([timeCounter,numOfEvents]);
				//$scope.nvWsStatisticData[0]["values"].push([timeCounter,Math.floor(Math.random() * 9) + 1]);
				$scope.nvWsStatisticData[1]["values"].push([timeCounter,totalError]);
				//$scope.nvWsStatisticData[1]["values"].push([timeCounter,Math.floor(Math.random() * 6) + 1]);
				timeCounter +=2;

			});
		}, function() {
		}, '/');
	};


	// last message
	$scope.wsLastMessage = "";
	$scope.wsLastMessageToShow = "";


	$scope.wsClientData = webSocketService();
	var connectWSClientData = function(){
		$scope.wsClientData.connect(function(message) {
			//console.debug("message", message); //"/topic/ten1.flussoProva.raw"
			$scope.wsUrl = Helpers.stream.wsOutputUrl($scope.stream);
			console.debug("subscribe wsUrl ", $scope.wsUrl);

			$scope.wsClientData.subscribe($scope.wsUrl, function(message) {
				console.debug("data message", message);
				$scope.wsLastMessage = JSON.stringify(JSON.parse(message.body), null, "\t");
				console.debug("___________$scope.wsLastMessage", $scope.wsLastMessage);

				if ($scope.wsLastMessageToShow == "")
					$scope.wsLastMessageToShow = $scope.wsLastMessage;
			});

		}, function() {
		}, '/');
	};

	$scope.wsClientError = webSocketService();
	var connectWSClientError = function(){
		$scope.wsClientError.connect(function(message) {
			console.debug("message", message); //"/topic/ten1.flussoProva.raw"
			console.debug("$scope.stream", $scope.stream); //"/topic/ten1.flussoProva.raw"
			console.debug("Helpers", Helpers); //"/topic/ten1.flussoProva.raw"

			var wsErrorUrl = Helpers.stream.wsErrorUrl($scope.stream);
			console.debug("subscribe wsErrorUrl ", wsErrorUrl);

			 $scope.wsClientError.subscribe(wsErrorUrl, function(message) {
				console.debug("Error message", message);
				totalError++;
			});

		}, function() {
		}, '/');
	};
	
	*/

	$scope.refreshLastMessage = function() {
		$scope.wsLastMessageToShow = $scope.wsLastMessage;
	};
	
	

	//$scope.lineData = [ { x : 1, y : 5 }, { x : 20, y : 20 }, { x : 40, y : 10 }, { x : 60, y : 40 }, { x : 80, y : 5 }, { x : 100, y : 60 } ];
} 
]);
appControllers.controller('DashboardErrorLogCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'webSocketService', "$filter",
                                                     function($scope, $routeParams, fabricAPIservice, webSocketService, $filter) {
	$scope.tenant_sel = null;
	$scope.tenant_sel_code = "*";
	$scope.tenantsList = [];
	$scope.errorList = [];
	$scope.accordionOpenError = [];
	$scope.openedIndex = true;
	$scope.closeIndex = false;
	$scope.wsClientSubsctiption = null;
	
	console.debug("DashboardErrorLogCtrl");
	$scope.wsClientError = webSocketService();
	
	var connectWSClientError = function(){
		console.debug("connectWSClientError");
		$scope.wsClientError.connect(function(message) {
			console.debug("message", message); //"/topic/ten1.flussoProva.raw"
			console.debug("$scope.stream", $scope.tenant_sel_code); //"/topic/ten1.flussoProva.raw"
			console.debug("Helpers", Helpers); //"/topic/ten1.flussoProva.raw"
			$scope.errorList = [];
			$scope.accordionOpenError = [];
			subscribeWSClientError();
		}, function(message) {
			console.debug("Can't Connect on WebSocket");
					//alert("Can't Connect on WebSocket");
		}, '/');
	};
	
	
	var subscribeWSClientError = function(){
	
		var wsErrorUrl = Helpers.errors.wsErrorUrl($scope.tenant_sel_code);
		console.debug("subscribe wsErrorUrl ", wsErrorUrl);

		$scope.wsClientSubsctiption = $scope.wsClientError.subscribe(wsErrorUrl, function(message) {
			$scope.wsLastMessage = JSON.stringify(JSON.parse(message.body), null, "\t");
			$scope.errorList.unshift(JSON.parse(message.body));
			$scope.accordionOpenError.unshift($scope.closeIndex);
			
			$scope.errorList= $scope.errorList.slice(0,Constants.MAX_NR_ERROR_LOGS); 
			$scope.accordionOpenError=$scope.accordionOpenError.slice(0,Constants.MAX_NR_ERROR_LOGS);
			console.debug("Error $scope.errorList : ", $scope.errorList);				
		});
	};
	
	$scope.oneAtATime = true;

	$scope.selectTenant = function(tenant){
		console.debug("tenant", tenant);
		$scope.tenant_sel_code = tenant;

		$scope.errorList = [];
		$scope.accordionOpenError = [];
		console.debug("$scope.wsClientSubsctiption",$scope.wsClientSubsctiption);
		$scope.wsClientSubsctiption.unsubscribe();
		subscribeWSClientError();
	};
	
	
	fabricAPIservice.getTenants().success(function(response) {
		console.debug("response", response.tenants);
		$scope.tenantsList = response.tenants.tenant;		
	
	});
	
	//prendo tutti gli errori, se non ho selezionato un tenant
	connectWSClientError();

} 
]);
