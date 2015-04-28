appControllers.controller('StreamsCtrl', [ '$scope', "$route", 'fabricAPIservice', function($scope, $route, fabricAPIservice, filterFilter) {
		
	$scope.streamsList = [];
	$scope.filteredStreamsList = [];
	$scope.tenantsFilter = null;
	$scope.codeFilter = null;
	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.streamsList.length;
	$scope.predicate = '';
	$scope.showLoading = true;

	fabricAPIservice.getVisibleStreams().success(function(response) {
		$scope.showLoading = false;
		
		var responseList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		for (var i = 0; i < responseList.length; i++) {
			console.debug("responseList[i].visibility : ",responseList[i].visibility,responseList[i].codiceTenant);
				$scope.streamsList.push(responseList[i]);					
		}
	
		
		for (var i = 0; i < $scope.streamsList.length; i++) {
			$scope.streamsList[i].statusIcon = Helpers.stream.statusIcon($scope.streamsList[i]);
			if(!$scope.streamsList[i].streamIcon || $scope.streamsList[i].streamIcon == null)
				$scope.streamsList[i].streamIcon  = "img/stream-icon-default.png";
		}

		$scope.totalItems = $scope.streamsList.length;
	});

	$scope.searchTenantsFilter = function(stream) {
		var keyword = new RegExp($scope.tenantsFilter, 'i');
		return !$scope.tenantsFilter || keyword.test(stream.codiceTenant);
	};

	$scope.$watch('tenantsFilter', function(newTenant) {
		$scope.currentPage = 1;

		$scope.totalItems = $scope.filteredStreamsList.length;
		console.log("newTenant", newTenant);
	});
	
	$scope.searchCodeFilter = function(stream) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(stream.codiceStream)|| keyword.test(stream.nomeStream);
	};

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;

		$scope.totalItems = $scope.filteredStreamsList.length;
		console.log("newCode", newCode);
	});

} ]);

appControllers.controller('StreamCtrl', [ '$scope', "$route", 'fabricAPIservice', function($scope, $route, fabricAPIservice) {
} ]);

