appControllers.controller('DashboardCtrl', [ '$scope', "$route", 'fabricAPIservice', function($scope, $route, fabricAPIservice) {
	
    $scope.streamDetail = {};
    $scope.streamDetail.stream = null;
    
    $scope.changeSection = function(newSection){$scope.currentSection = newSection;}

    $scope.changeSection('streamsSection');
} ]);
