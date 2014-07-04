'use strict';

/* Controllers */

var appControllers = angular.module('userportal.controllers', []);

appControllers.controller('NavigationCtrl', [ '$scope', "$route", '$translate', function($scope, $route, $translate) {
	$scope.$route = $route;
	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};
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
		$scope.streamsList = response.streams;
		$scope.totalItems = $scope.streamsList.length;
		$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	});

	$scope.selectPage = function() {
		$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	};

	$scope.searchTenantsFilter = function(stream) {
		var keyword = new RegExp($scope.tenantsFilter, 'i');
		return !$scope.tenantsFilter || keyword.test(stream.tenant);
	};
	
	$scope.$watch('tenantsFilter', function (newTenant) {
        $scope.currentPage = 1;

    //   $scope.filteredStreamsList = $filter('filter')($scope.streamsList, $scope.tenant);
        $scope.totalItems = $scope.filteredStreamsList.length;
        console.log("newTenant", newTenant);
    });

} ]);

appControllers.controller('DashboardStreamCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'webSocketService', "$filter",
		function($scope, $routeParams, fabricAPIservice, webSocketService, $filter) {
			$scope.stream = null;
			fabricAPIservice.getStream($routeParams.id_stream).success(function(response) {
				$scope.stream = response.stream;
			});

			var maxNumWsStatisticMessages = 4;
			$scope.wsStatisticMessages = [ [ "-", "-" ], [ "-", "-" ], [ "-", "-" ], [ "-", "-" ], [ "-", "-" ] ];
			var maxNumStatisticData = 30;
			var counter = 0;
			$scope.wsStatisticData = [ {
				x : counter,
				y : 0
			} ];
			for (counter = 1; counter < maxNumStatisticData; counter++)
				$scope.wsStatisticData.push({
					x : counter,
					y : 0
				});

			$scope.wsClientStatistics = webSocketService();
			$scope.wsClientStatistics.connect(function(message) {
				console.debug("message", message);
				$scope.wsClientStatistics.subscribe("/topic/ten1.flussoProva.stat", function(message) {
					// $scope.wsClientStatistics.subscribe("/stats",
					// function(message) {
					console.debug("message", message);
					counter++;
					console.debug("wsStatisticMessages", $scope.wsStatisticMessages);

					if ($scope.wsStatisticMessages.length > maxNumWsStatisticMessages)
						$scope.wsStatisticMessages.shift();

					console.debug("wsStatisticData", $scope.wsStatisticData);
					if ($scope.wsStatisticData.length > maxNumStatisticData)
						$scope.wsStatisticData.shift();

					var numOfEvents = angular.fromJson(message.body).event.payloadData.numEventsLast30Sec;

					$scope.wsStatisticMessages.push([ $filter('date')(new Date(), "HH:mm:ss"), numOfEvents ]);

					$scope.wsStatisticData.push({
						x : counter,
						y : numOfEvents
					});

				});
			}, function() {
			}, '/');

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

			$scope.lineData = [ {
				x : 1,
				y : 5
			}, {
				x : 20,
				y : 20
			}, {
				x : 40,
				y : 10
			}, {
				x : 60,
				y : 40
			}, {
				x : 80,
				y : 5
			}, {
				x : 100,
				y : 60
			} ];
		} ]);

appControllers.controller('MarketCtrl', [ '$scope', function($scope) {
} ]);
