/* Controllers */

appControllers.controller('ManagementNavigationCtrl', [ '$scope', "$route",'info','$modal', 'adminAPIservice', '$translate', function($scope, $route, info, $modal, adminAPIservice, $translate) {
	$scope.$route = $route;
	if(!info.canManageStream() && ($scope.managementTab == 'streams' || $scope.managementTab == 'editStream' || $scope.managementTab == 'viewStream' || $scope.managementTab == 'newStream'|| $scope.managementTab == 'newStreamInternal' ||
			$scope.managementTab == 'virtualentities' || $scope.managementTab == 'editVirtualentity' || $scope.managementTab == 'viewVirtualentity' || $scope.managementTab == 'newVirtualentity'))
		$scope.managementTab = 'datasets';
	else
		$scope.managementTab = $route.current.params.managementTab;
	
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
	
	
	// domains
	$scope.domainList = [];
	adminAPIservice.loadDomains().success(function(response) {
		console.log("loadDomains", response);
		response.sort(function(a, b) { 
		    return ((a.langit < b.langit) ? -1 : ((a.langit > b.langit) ? 1 : 0));
		});
		for (var int = 0; int < response.length; int++) {
			$scope.domainList.push(response[int].domaincode);
		}
	});

	$scope.subdomainList = [];
	$scope.selectSubdomain = function(domain){
		$scope.subdomainList = [];
		adminAPIservice.loadSubDomains(domain).success(function(response) {
			response.sort(function(a, b) { 
			    return ((a.langit < b.langit) ? -1 : ((a.langit > b.langit) ? 1 : 0));
			});
			for (var int = 0; int < response.length; int++) {
				$scope.subdomainList.push(response[int].subdomaincode);
			}
		});
	};
	
	
	// tags

	$scope.tagList = [];
	var loadTags = function(){
		adminAPIservice.loadTags().success(function(response) {
			console.log("loadTags", response);
			for (var int = 0; int < response.length; int++) {
				var tagLabel = $translate.use()=='it'?response[int].langit:response[int].langen;
				$scope.tagList.push({"idTag": response[int].idTag, "tagCode":response[int].tagcode, "tagLabel":tagLabel} );
			}
			
			$scope.tagList.sort(function(a, b) { 
			    return ((a.tagLabel < b.tagLabel) ? -1 : ((a.tagLabel > b.tagLabel) ? 1 : 0));
			});
			
		});
	};
	
	if($scope.tagList.length==0)
		loadTags();
	
	$scope.showChooseTagTable = function(){
		var chooseTagDialog = $modal.open({
		  templateUrl: 'tagChooerDialog.html',
	      controller: 'ManagementChooseTagCtrl',
	      size: 'lg',
	      scope: $scope,
	      resolve: {
	    	  tagList: function () {return $scope.tagList;},
	      	}
    	});
		
		chooseTagDialog.result.then(function (selectedTag) {
			$scope.$broadcast ('addTag', selectedTag);
	    }, function () {});
	};

	
	$scope.showChooseTagTableInDialog = function(){
		var chooseTagDialog = $modal.open({
	      templateUrl: 'tagChooerDialog.html',
	      controller: 'ManagementChooseTagCtrl',
	      size: 'lg',
	      scope: $scope,
	      resolve: {
	    	  tagList: function () {return $scope.tagList;},
	      	}
    	});
		
		chooseTagDialog.result.then(function (selectedTag) {
			$scope.$broadcast ('addTag');
			return selectedTag;
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};
	
	// tenants
	
	$scope.tenantsList = [];
	adminAPIservice.loadTenants().success(function(response) {
		console.debug("response", response);
		try{
			$scope.tenantsList = [];
			for (var int = 0; int <  response.length; int++) {
				var t = response[int];
				if(t.tenantcode!=$scope.tenant)
					$scope.tenantsList.push(t);
			}
			
			$scope.tenantsList.sort(function(a, b) { 
			    return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
			});

		}
		catch (e) {
			log.error("loadTenants ERROR",e);
		}
		
	});
	
	$scope.showChooseTenantTable = function(){
		var chooseTenantDialog = $modal.open({
	      templateUrl: 'tenantChooerDialog.html',
	      controller: 'ManagementChooseTenantCtrl',
	      size: 'lg',
	      scope: $scope,
	      resolve: {
	    	  tenantsList: function () {return $scope.tenantsList;},
	      	}
    	});
		
		chooseTenantDialog.result.then(function (selectedTenant) {
			$scope.$broadcast ('addTenant', selectedTenant);
	    }, function () {});
		
	};
	
	$scope.streamIconUrl= function(organizationCode, idstream){
		return Constants.API_ADMIN_STREAM_URL.replace(new RegExp('{organizationCode}', 'gi'), organizationCode)+"/"+idstream+"/icon";
	};

}]);


appControllers.controller('ManagementChooseTagCtrl', [ '$scope', '$modalInstance', 'tagList',
                                                                        function($scope, $modalInstance, tagList) {
	
	$scope.tagMap = {};
	var firstLetter = null;
	for (var i = 0; i < tagList.length; i++) {
		if(firstLetter != tagList[i].tagLabel.substring(0,1)){
			firstLetter = tagList[i].tagLabel.substring(0,1);
			$scope.tagMap[firstLetter] = new Array();
		}
		$scope.tagMap[firstLetter].push(tagList[i]);
	}
	
	
	$scope.chooseTag = function(choosenTag){
		console.log("chooseTag",choosenTag);
		$modalInstance.close(choosenTag);
	};
	
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);


appControllers.controller('ManagementChooseTenantCtrl', [ '$scope', '$modalInstance', 'tenantsList',
                                                                           function($scope, $modalInstance, tenantsList) {
   	console.log("ManagementChooseTenantCtrl",tenantsList);
   	
   	$scope.tenantsList = tenantsList;

   	$scope.chooseTenant = function(choosenTenant){
   		console.log("choosenTenant",choosenTenant);
   		$modalInstance.close(choosenTenant);
   	};
   	
   	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
 }]);

