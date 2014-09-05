/* Controllers */

 //var appControllers = angular.module('userportal.controllers', []);

 //appControllers.controller('DashboardCtrl', ['$scope', function($scope) {}]);
 
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
			console.log("response", response);
			$scope.streamsList = response.streams.stream;
			$scope.totalItems = $scope.streamsList.length;
			$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
		});

		$scope.selectPage = function() {
			$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
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
				connectWSStatistic();
				connectWSClientData();
				connectWSClientError();
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

			$scope.refreshLastMessage = function() {
				$scope.wsLastMessageToShow = $scope.wsLastMessage;
			};

			//$scope.lineData = [ { x : 1, y : 5 }, { x : 20, y : 20 }, { x : 40, y : 10 }, { x : 60, y : 40 }, { x : 80, y : 5 }, { x : 100, y : 60 } ];
		} 
	]);

	appControllers.controller('DashboardErrorLogCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'webSocketService', "$filter",
		function($scope, $routeParams, fabricAPIservice, webSocketService, $filter) {
			$scope.tenant = null;
			$scope.tenantsList = [];
			fabricAPIservice.getTenants().success(function(response) {
				$scope.tenantsList = response.tenants;
			});

	/*
			// last message
			$scope.wsLastMessage = "";
			$scope.wsLastMessageToShow = "";

			$scope.wsClientData = webSocketService();
			$scope.wsClientData.connect(function(message) {
				console.debug("message", message);
				$scope.wsClientData.subscribe("/topic/ten1.flussoProva.raw", function(message) {
					console.debug("data message", message);
					$scope.wsLastMessage = JSON.stringify(JSON.parse(message.body), null, "\t");
					if ($scope.wsLastMessageToShow == "")
						$scope.wsLastMessageToShow = $scope.wsLastMessage;
				});

			}, function() {
			}, '/');

			$scope.refreshLastMessage = function() {
				$scope.wsLastMessageToShow = $scope.wsLastMessage;
			};
	*/
		} 
	]);