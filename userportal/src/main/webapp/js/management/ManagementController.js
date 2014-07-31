/* Controllers */

appControllers.controller('ManagementNavigationCtrl', [ '$scope', "$route",  function($scope, $route) {
	$scope.$route = $route;
	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};
} ]);

appControllers.controller('ManagementCtrl', [ '$scope', function($scope) {
} ]);
