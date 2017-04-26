/* Controllers */

appControllers.controller('ManagementNavigationCtrl', [ '$scope', "$route",'info',  function($scope, $route, info) {
	$scope.$route = $route;
	if(info.canManageStream())
		$scope.managementTab = $route.current.params.managementTab;
	else
		$scope.managementTab = 'datasets';
	
	$scope.tenant = $route.current.params.tenant_code;

	$scope.buildTimestamp = BuildInfo.timestamp;

	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};
	
	$scope.isMenuActive= function(menuItem){

		var result = false;
		switch (menuItem){
		case 'dashboard':
			result =  ($scope.managementTab == 'dashboard');
			break;
		case 'streams':
			result =  ($scope.managementTab == 'streams' || $scope.managementTab == 'editStream' || $scope.managementTab == 'viewStream' || $scope.managementTab == 'newStream'|| $scope.managementTab == 'newStreamInternal');
			break;
		case 'virtualentities':
			result =  ($scope.managementTab == 'virtualentities' || $scope.managementTab == 'editVirtualentity' || $scope.managementTab == 'viewVirtualentity' || $scope.managementTab == 'newVirtualentity');
			break;
		case 'datasets':
			result =  ($scope.managementTab == 'datasets' || $scope.managementTab == 'editDataset' || $scope.managementTab == 'viewDataset' || $scope.managementTab == 'newDataset' ||  $scope.managementTab == 'uploadDataset');
			break;
		default:
			break;
		}
		return result;
	};
	
}]);







appControllers.controller('ManagementChooseTenantCtrl', [ '$scope', 'fabricAPIservice', function($scope, fabricAPIservice) {

	$scope.tenantsList = null;

	fabricAPIservice.getTenants().success(function(response) {
		console.log("response",response);
		$scope.tenantsList = response.tenants.tenant;
		console.log("$scope.tenantsList",$scope.tenantsList);

	});

} ]);
