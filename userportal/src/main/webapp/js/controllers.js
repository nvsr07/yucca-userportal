'use strict';

/* Controllers */

var appControllers = angular.module('userportal.controllers', []);

appControllers.controller('GlobalCtrl', [ '$scope', "$route", '$modal', 'info','$location', '$translate', 'upService', 'localStorageService', 'storeAPIservice','$window',
                                          function($scope, $route, $modal, info, $location, $translate, upService, localStorageService,storeAPIservice,$window) {
	$scope.$route = $route;
	
	$scope.currentLang = function(){return $translate.use();};
	
	
	console.log("$location", $location);
	
	$scope._origin = $window.location.origin;
	$scope._contextPath = $window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
	$scope._baseUrl = $scope._origin + $scope._contextPath;
	
	$scope.$on("$routeChangeSuccess", function(event, current, previous){
		console.log("$routeChangeSuccess.current",current);
	     $scope.isHomepage = current.$$route.isHomepage;
	     console.log("isHomepage", $scope.isHomepage, current.activetab);
	 });

	
	$scope.storeUrl = '/store/';	
	console.log("storeUrl",$scope.storeUrl);
	
	$scope.DEFAULT_DATASET_ICON = Constants.DEFAULT_DATASET_ICON;
	$scope.DEFAULT_STREAM_ICON = Constants.DEFAULT_STREAM_ICON;

	var supportedLanguages = ['it', 'en'];

	var langParam = $location.search().lang;
	if(typeof langParam != 'undefined' && supportedLanguages.indexOf(langParam)>=0){
		$translate.use(langParam);
	}

	
	$scope.isAuthorized = function(operation){
		var authorized = info.isAuthorized(operation);
		return authorized;
	};
	
	$scope.canManageStream= function(){
		return info.canManageStream();
	};
	
	$scope.userTenants = null;
	
	var checkTermCondition = function(){ 
		$scope.activeTenantType = info.getActiveTenantType();
		if (($scope.activeTenantCode != 'sandbox') && ($scope.activeTenantCode != null)){
			if(typeof $scope.user.acceptTermConditionTenants == 'undefined')
				$scope.user.acceptTermConditionTenants = [];
			
			if($scope.user.acceptTermConditionTenants.indexOf($scope.activeTenantCode)<0){
				var modalAcceptTermConditionInstance = $modal.open({
					animation : $scope.animationsEnabled,
					templateUrl : 'termAndConditionModal.html',
					controller : 'TermAndConditionModalCtrl',
					backdrop  : 'static',
					keyboard : false,
					size : 0,
				      resolve: {
				    	  activeTenantType: function () {
				            return $scope.activeTenantType;
				          }
				        }
				});
	
				modalAcceptTermConditionInstance.result.then(function() {
					console.log("modalAcceptTermConditionInstance ok");
				}, function() {
					console.debug("Not accepted term and conditions");
					$location.path("/userportal/api/authorize?logout={{user.username}}&returnUrl=%23%2Fhome%3F");
					console.log("path", $location.path());
				});
			}
		}
	};
	
	upService.getInfo().success(function(result) {
		info.setInfo(result);
		
		console.log("info", info);
		
		$scope.activeTenantCode = info.getActiveTenantCode();
		//$scope.userTenants = info.getInfo().user.tenants;
		$scope.userTenantsToActivate = new Array();
		$scope.managementUrl = '#/management/virtualentities/'+info.getActiveTenantCode();
		$scope.user = result.user; 

		$scope.user.haveTrialTenant = false;
		//$scope.user.haveTrialTenantToActivate = false;
		$scope.user.havePersonalTenant = false;
		//$scope.user.havePersonalTenantToActivate = false;
		angular.forEach($scope.user.tenants, function(value, key) {
			console.log("value", value)
			if (value.tenantType.tenanttypecode == "trial")
				$scope.user.haveTrialTenant = true;
			});
		angular.forEach($scope.user.tenants, function(value, key) {
			if (value.tenantType.tenanttypecode == "personal")
				$scope.user.havePersonalTenant = true;
			});

		$scope.user.canChangePassword = false;
		try {
			if($scope.user.username.indexOf("_AT_") === -1 && !Helpers.util.isItalianCF($scope.user.username)){
				$scope.user.canChangePassword = true;
			}
		} catch (e) {
			log.error("Error while check if user can change password", user,  e);
			$scope.user.canChangePassword = false;
		}
		
		
		
		try{
			$scope.BuildInfo.timestamp = BuildInfo.timestamp;
		} catch (e) {
			if(typeof $scope.BuildInfo == 'undefined')
				$scope.BuildInfo = {};
			$scope.BuildInfo.timestamp = new Date().getMilliseconds();
		}
		
		
		checkTermCondition();

		console.log('info', info);
		console.log('activeTenantCode', $scope.activeTenantCode);
		console.log('userTenants', $scope.user.tenants);
		console.log('userTenantsToActivate', $scope.userTenantsToActivate);
		console.log('managementUrl', $scope.managementUrl);
		console.log('user', $scope.user);
		$scope.info = info.getInfo();
		if ($scope.user.loggedIn)
			gestModalWindow();
		

	});
	
	var gestModalWindow = function(){ 

			$scope.user.authType = $scope.user.authType || "local";
			if (!$scope.user.isStrongUser){  //Compare la modale perchè non hai credenziali strong!
				$scope.openForceLogout();
				$scope.user.authType = "notStrong";
			} else if ($scope.user.isTechnicalUser){
				$scope.openForceLogout();
				$scope.user.authType = "tecnical";
			} else if ($scope.user.tenants == 'undefined' || $scope.user.tenants.length == 0 ){
					if ($scope.user.isSocialUser &&  typeof info.getInfo().trialTenantToActivated == 'undefined'){
						$scope.user.authType = "social";
						$scope.openRequestTenant('trial', true);
					} else if(!$scope.user.isSocialUser && typeof info.getInfo().personalTenantToActivated == 'undefined'){
						$scope.openRequestTenant('pesonal', true);
					}
			} else {
				//Tutto ok! NO MODAL
			}
			
			if ($scope.user.isSocialUser)
				$scope.user.authType = "social";
			
			console.log("user.authType", $scope.user.authType);
	
	};
	
	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};

	$scope.changeActiveTenant = function(newTenant){
		upService.getInfo(false, newTenant).success(function(result) {
			info.setInfo(result);
			$scope.activeTenantCode = info.getActiveTenantCode();
			$scope.managementUrl = '#/management/virtualentities/'+info.getActiveTenantCode();
			$location.path("#/");
			checkTermCondition();
		});
	};

	$scope.isHomepage = function() {
		if($location.path().substring(0, 5) === "/home"){
			return true;
		}	
		return false;
	};

	$scope.showCookieMessage = false;
	console.debug("acceptedCookies",acceptedCookies);

	var acceptedCookies = localStorageService.get("acceptedCookies");
	if(acceptedCookies == null)
		acceptedCookies = localStorageService.cookie.get("acceptedCookies");

	if(acceptedCookies != "yes")
		$scope.showCookieMessage = true;

	$scope.acceptCookie = function(){
		console.debug("acceptCookie");
		//$cookies.acceptedCookies = "yes";
		if(localStorageService.isSupported) {
			localStorageService.set("acceptedCookies", "yes");
		}
		else{
			localStorageService.cookie.set("acceptedCookies", "yes");
		}
		$scope.showCookieMessage = false;
	};
		
	console.log('location', $location.$$url);
	
	$scope.openRequestTenant = function(tenantType, hasNoTenant){
		var modalInstance = $modal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'requestTenant.html',
			controller : 'RequestTenantCtrl',
			size : 0,
			backdrop  : 'static',
			keyboard  : false,
			resolve: { 
				tenantType: function () {
					return tenantType;
				},
				user: function () {
					return $scope.user;
				},
				hasNoTenant: function () {
					return hasNoTenant;
				}
			}
		});

		modalInstance.result.then(function() {
			console.log("result -> ");
			upService.getInfo(true).success(function(result) {
				info.setInfo(result);
				$scope.info = info.getInfo();

			}).error(function(result) {
				console.error("refresh tenants ERROR", response);
			});
		}, function() {
		});
	};
	
	$scope.openForceLogout = function(){
		var modalInstance = $modal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'forceLogout.html',
			controller : 'ForceLogoutCtrl',
			size : 0,
			backdrop  : 'static',
			keyboard  : false,
			resolve: { 
				user: function () {
					return $scope.user;
				}
			}
		});

		modalInstance.result.then(function() {
		}, function() {
		});
	};

}]);


appControllers.factory("initCtrl", function(upService, info, $q) {
    return {
    	"getInfo": function() {
    	    	var promise = upService.getInfo();
    	        promise.success(function(result) {
    	    		info.setInfo(result);
    	    		console.log("result", result);
    	    		console.log("info", info);
    	    	});
    	        return promise;
    	      }
    	};
});

appControllers.controller('NavigationCtrl', [ '$scope', "$route", '$translate','webSocketService', '$modal', 'info', '$location', 
                                              function($scope, $route, $translate, webSocketService, $modal, info, $location) {
	$scope.$route = $route;
	//$scope.managementUrl = null;
	$scope.currentUrl = function() {
		return encodeURIComponent("#"+$location.path());
	};

	$scope.$on('$locationChangeStart', function(event) {
		console.debug("::::: $locationChangeStart ::::");
		if(WebsocketStompSingleton.getInstance()){			
			console.debug(":::::WebsocketStompSingleton.getInstance().cancelAllSubscriptions() ::::");
			WebsocketStompSingleton.getInstance().cancelAllSubscriptions();
		}
		if(webSocketService()){
			console.debug("::: webSocketService :::",webSocketService());
			webSocketService().unsubscribeAll();
		}
	});

	$scope.isUserLoggedIn = function() {
		return $route.current.isHomepage;
	};
	
	$scope.requestTT = function(tenantType){
		$scope.openRequestTenant('trial', false);
	};
	
	$scope.requestTP = function(tenantType){
		$scope.openRequestTenant('pesonal', false);
	};

}]);

appControllers.controller('HomeCtrl', [ '$scope', '$route', '$http', '$filter', 'odataAPIservice', '$modal', 'info', '$location', 
                                        function($scope, $route, $http, $filter, odataAPIservice, $modal, info, $location) {
	$scope.$route = $route;
	$scope.tenant = "";
	var $translate = $filter('translate');
	//showMap();

	$scope.isHomepage = function() {
		return true;
	};
	
	$scope.statistics = {};

	
	odataAPIservice.loadDataStatistics().success(function(response) {
		console.info("statistics", response);	
		$scope.statistics.total_tenants = response.totalOrganizations;
		$scope.statistics.total_streams = response.totalStreams;
		$scope.statistics.total_smart_objects = response.totalSmartobjects;

		$scope.statistics.total_data = response.totalData;
		$scope.statistics.total_measures = response.totalMeasures;
		$scope.statistics.today_data = response.yesterdayMeasures;
		if(typeof response.lastUpdateMillis != 'undefined' && response.lastUpdateMillis >0)
			$scope.statistics.lastupdate = new Date(response.lastUpdateMillis);

		//$scope.domainChartData = response.domains;
		var domains= [];
		for (var domain in response.domains) {
			if (response.domains.hasOwnProperty(domain)) {
				domains.push({key: $translate(domain), y:response.domains[domain]});
		    }
		}
		$scope.domainChartData = domains;
	}).error(function(response){
		console.error("statistics error", response);	
	});
	
 


	$scope.xDomainChartFunction = function(){
		return function(d) {
			return d.key;
		};
	};
	$scope.yDomainChartFunction = function(){
		return function(d) {
			return d.y;
		};
	};

	$scope.domainChartColors = ["#00521F","#006627","#007A2F","#008F37","#00973A","#00B846","#00CC4E","#00E056", "#00F55E"];

	
	$scope.animationsEnabled = true;
	 
} ]);


appControllers.controller('RequestTenantCtrl', [ '$scope', '$modalInstance', 'info', 'adminAPIservice', 'upService',  'tenantType', 'hasNoTenant', 'user',
                                                 function($scope, $modalInstance, info, adminAPIservice, upService, tenantType, hasNoTenant, user) {
	
	console.log("--->info = ", info);
	console.log("--->user = ", user);
	$scope.status = 'start';
	$scope.modalTitle = tenantType == 'trial'? 'REQUEST_TENANT_TRIAL_TITLE':'REQUEST_TENANT_PERSONAL_TITLE';
	$scope.modalIntro = tenantType == 'trial'? 'REQUEST_TENANT_TRAIL_INFO':'REQUEST_TENANT_PERSONAL_INFO';
	$scope.missingEmail = typeof user.email == 'undefined' || user.email == null || user.email == "";
	$scope.hasNoTenant = hasNoTenant;
	
	$scope.isValidEmai = function(){
		return Helpers.util.isValidEmail($scope.installationTenantRequest.useremail);
	};
	
	$scope.installationTenantRequest = {
			  "idTenantType": tenantType=='trial'?Constants.TENANT_TYPE_TRIAL_ID:Constants.TENANT_TYPE_PERSONAL_ID,
			  "useremail": user.email,
			  "userfirstname":  user.firstname,
			  "userlastname": user.lastname,
			  "username":user.username,
			  "usertypeauth":  tenantType=='trial'?'social':'default'
			  //"usertypeauth": info.getActiveTenant().usertypeauth
			};
	
	$scope.validationError = {};
	$scope.requestTenant = function(){
		console.log("requestTenant - installationTenantRequest", $scope.installationTenantRequest);
		$scope.validationError = {};
		if(!Helpers.util.isValidEmail($scope.installationTenantRequest.useremail)){
			$scope.validationError.detail = 'WARNING_TITLE';
			$scope.validationError.detail = 'REQUEST_TENANT_EMAIL_ERROR';
			$scope.validationError.type='warning';

		}
		else{
			$scope.status = 'sending';
			adminAPIservice.createTenant($scope.installationTenantRequest).success(function(response) {
				console.log("createTenant SUCCESS", response);
				$scope.status = 'finish';
				$scope.requestResponse = {};
				$scope.requestResponse.message=response.errorName;
				$scope.requestResponse.code=response.errorCode;
				$scope.requestResponse.detail=response.description;
				$scope.requestResponse.type='success';
				response;
			}).error(function(response){
				console.error("createTenant ERROR", response);
				$scope.status = 'finish';
				$scope.requestTenantError = {};
				$scope.requestTenantError.message=response.errorName;
				$scope.requestTenantError.errorCode=response.errorCode;
				$scope.requestTenantError.detail=response.description;
				$scope.requestTenantError.type='danger';
				

	
			});
		}
	};
	
	$scope.cancel = function () {
		if($scope.status == 'finish')
			$modalInstance.close();
		else
			$modalInstance.dismiss('cancel');
			
	};
	
}]);



appControllers.controller('ForceLogoutCtrl', [ '$scope', '$modalInstance', 'user',
                                                 function($scope, $modalInstance, user) {
	console.log("--->user = ", user);
	$scope.modalIntro = user.isStrongUser? 'HOME_LOGGED_NOT_STRONG_AUTHENTICATION':'HOME_LOGGED_TECHNICAL_AUTHENTICATION';
	
}]);

appControllers.controller('TermAndConditionModalCtrl', [ '$scope', '$routeParams', '$location', '$modalInstance', 'info', 'upService', 'activeTenantType','$translate',
                                                 function($scope, $routeParams, $location, $modalInstance, info, upService , activeTenantType,$translate) {

	if(typeof activeTenantType == 'undefined' || activeTenantType == null)
		activeTenantType = 'default';
	if(activeTenantType!='trial')
		activeTenantType = 'default';
	$scope.showLoading = false;
	$scope.termConditionContent = 'partials/common/termCondition/termCondition_'+activeTenantType+'_'+$translate.use() +".html";
	$scope.acceptTermAndCondition = function () {
		$scope.showLoading = true;
		upService.acceptTermConditionForTenant(info.getActiveTenantCode()).success(function(info){
			console.log("acceptTermConditionForTenant a", info);
			$scope.showLoading = false;
			$modalInstance.close();
		}).error(function(e){
			console.log("error",e);
			$scope.showLoading = false;
			$location.path("/userportal/api/authorize?logout={{user.username}}&returnUrl=%23%2Fhome%3F");
		});
		
	};

	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
		$location.path("/userportal/api/authorize?logout={{user.username}}&returnUrl=%23%2Fhome%3F");
	};
}]);
