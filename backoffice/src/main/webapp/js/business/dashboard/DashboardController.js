appControllers.controller('DashboardCtrl', [ '$scope', "$route", 'fabricAPIservice', function($scope, $route, fabricAPIservice) {
	
	$scope.currentSection = 'streamsSection';
    $scope.streamDetail = {};
    $scope.streamDetail.stream = null;
} ]);
