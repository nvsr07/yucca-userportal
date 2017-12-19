'use strict';

/* Controllers */

var appControllers = angular.module('userportal.controllers', []);

appControllers.controller('GlobalCtrl', [ '$scope', "$route", '$modal', 'info','$location', '$translate', 'fabricAPIservice','upService', 'localStorageService', 'storeAPIservice','$window',
                                          function($scope, $route, $modal, info, $location, $translate, fabricAPIservice, upService, localStorageService,storeAPIservice,$window) {
	$scope.$route = $route;
	
	$scope.currentLang = function(){return $translate.use();};
	
	
	console.log("$location", $location);
	
	$scope._origin = $window.location.origin;
	$scope._contextPath = $window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
	$scope._baseUrl = $scope._origin + $scope._contextPath;
	
	$scope.$on("$routeChangeSuccess", function(event, current, previous){
	     $scope.isHomepage = current.$$route.isHomepage;
	     console.log("isHomepage", $scope.isHomepage, current.activetab);
	 });

	
	$scope.storeUrl = '/store/';	
	console.log("storeUrl",$scope.storeUrl);
	$scope.DEFAULT_STREAM_ICON = "img/stream-icon-default.png";
	$scope.DEFAULT_DATASET_ICON = "img/dataset-icon-default.png";

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
			if (value.tenantType == "trial")
				$scope.user.haveTrialTenant = true;
			});
		angular.forEach($scope.user.tenants, function(value, key) {
			if (value.tenantType == "personal")
				$scope.user.havePersonalTenant = true;
			});

//		if (typeof info.getInfo().personalTenantToActivated != 'undefined'){
//			$scope.user.havePersonalTenantToActivate = true;
//			$scope.userTenantsToActivate.push(info.getInfo().personalTenantToActivated);
//		}
//
//		if (typeof info.getInfo().trialTenantToActivated != 'undefined'){
//			$scope.user.haveTrialTenantToActivate = true;
//			$scope.userTenantsToActivate.push(info.getInfo().trialTenantToActivated);
//		}
		
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
//				$scope.openModalWindow('HPModalContent.html', 'HomePageModalCtrl', 'strong', 'notenant');
				$scope.user.authType = "notStrong";
			} else if ($scope.user.isTechnicalUser){
				$scope.openForceLogout();
				$scope.user.authType = "tecnical";
				//$scope.openModalWindow('HPModalContent.html', 'HomePageModalCtrl', 'tecnical', 'notenant');
			} else if ($scope.user.tenants == 'undefined' || $scope.user.tenants.length == 0 ){
				if(typeof info.getInfo().personalTenantToActivated != 'undefined' && typeof info.getInfo().trialTenantToActivated != 'undefined' ){
				//if ((!$scope.user.haveTrialTenantToActivate) && (!$scope.user.havePersonalTenantToActivate)){
					if ($scope.user.isSocialUser){
						$scope.user.authType = "social";
						$scope.openRequestTenant('trial', true);
						//$scope.openModalWindow('HPModalContent.html', 'HomePageModalCtrl', 'social', 'notenant');
					} else {
						$scope.openRequestTenant('pesonal', true);
						//$scope.openModalWindow('HPModalContent.html', 'HomePageModalCtrl', 'tenant', 'notenant');
					}
				} else {
					//Tutto ok! NO MODAL
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
//			info.setActiveTenantCode(newTenant);
//			$scope.activeTenantCode = info.getActiveTenantCode();
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
	//var acceptedCookiesOLD = $cookies.acceptedCookies;
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
	
//	$scope.openModalWindow = function(templateUrlParam, controllerParam, opParam, tenantType){
//		var modalInstance = $modal.open({
//			animation : $scope.animationsEnabled,
//			templateUrl : templateUrlParam,
//			controller : controllerParam,
//			size : 0,
//			backdrop  : 'static',
//			keyboard  : false,
//			resolve: { 
//				op: function () {
//					return opParam;
//				},
//				tenantType: function () {
//					return tenantType;
//				},
//				globalUser: function(){
//					return $scope.user;
//				},
//				globalUserTenantsToActivate: function(){
//					return $scope.userTenantsToActivate;
//				}
//			}
//		});
//
//		modalInstance.result.then(function(selectedItem) {
//			$scope.selected = selectedItem;
//		}, function() {
//			console.info('Modal dismissed at: ' + new Date());
//		});
//	};
	
	
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
				//				$scope.userTenantsToActivate = new Array();
//				$scope.user.haveTrialTenantToActivate = false;
//				if (typeof info.getInfo().trialTenantToActivated != 'undefined'){
//					$scope.user.haveTrialTenantToActivate = true;
//					$scope.userTenantsToActivate.push(info.getInfo().trialTenantToActivated);
//				}
//				
//				$scope.user.havePersonalTenantToActivate = false;
//				if (typeof info.getInfo().personalTenantToActivated != 'undefined'){
//					$scope.user.havePersonalTenantToActivate = true;
//					$scope.userTenantsToActivate.push(info.getInfo().personalTenantToActivated);
//				}

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
//    	    		$scope.activeTenantCode = info.getActiveTenantCode();
//    	    		$scope.userTenants = info.getInfo().user.tenants;
//    	    		$scope.managementUrl = '#/management/virtualentities/'+info.getActiveTenantCode();
//    	    		$scope.user = result.user;
//    	    		
//    	    		$scope.user.haveTrialTenant = false;
//    	    		angular.forEach($scope.userTenants, function(value, key) {
//    	    		  if (value.tenantType == "trial")
//    	    			  $scope.user.haveTrialTenant = true;
//    	    		});
    	    	});
    	        return promise;
    	      }
    	};
});

appControllers.controller('NavigationCtrl', [ '$scope', "$route", '$translate','webSocketService', 'fabricAPIservice', '$modal', 'info', '$location', 
                                              function($scope, $route, $translate, webSocketService, fabricAPIservice, $modal, info, $location) {
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

//		$scope.showTTForm = true;
//		$scope.openModalWindow('HPModalContent.html', 'HomePageModalCtrl', 'newTT', tenantType);
	};
	
	$scope.requestTP = function(tenantType){
		$scope.openRequestTenant('pesonal', false);

//		$scope.showTPForm = true;
//		$scope.openModalWindow('HPModalContent.html', 'HomePageModalCtrl', 'newTP', tenantType);
	};
	
//	$scope.openModalWindow = function(templateUrlParam, controllerParam, opParam, tenantType){
//		var modalInstance = $modal.open({
//			animation : $scope.animationsEnabled,
//			templateUrl : templateUrlParam,
//			controller : controllerParam,
//			size : 0,
//			backdrop  : 'static',
//			keyboard  : false,
//			resolve: {
//				op: function () {
//					return opParam;
//				},
//				tenantType: function () {
//					return tenantType;
//				},
//				globalUser: function(){
//					return $scope.user;
//				},
//				globalUserTenantsToActivate: function(){
//					return $scope.userTenantsToActivate;
//				}
//			}
//		});
//
//		modalInstance.result.then(function(selectedItem) {
//			$scope.selected = selectedItem;
//		}, function() {
//			console.info('Modal dismissed at: ' + new Date());
//		});
//	};
}]);

appControllers.controller('HomeCtrl', [ '$scope', '$route', '$http', '$filter', 'fabricAPIservice', 'odataAPIservice', 'fabricAPImanagement', '$modal', 'info', '$location', 
                                        function($scope, $route, $http, $filter, fabricAPIservice,  odataAPIservice, fabricAPImanagement,  $modal, info, $location) {
	$scope.$route = $route;
	$scope.tenant = "";
	var $translate = $filter('translate');
	//showMap();

	$scope.isHomepage = function() {
		return true;
	};
	
	//console.debug(" $location",  $location);
	//var scrollTo  = $location.search().scrollTo;
	//console.debug(" scrollTo",  scrollTo);
	//if(scrollTo){
	//	Helpers.util.scrollTo(scrollTo);
	//}
	$scope.statistics = {};

	//loadDataStatistics()
	/*
	fabricAPImanagement.loadDataStatistics().success(function(response) {
		console.debug("statistics", response);	
		$scope.statistics.total_tenants = response.lifetime.total_tenants;
		$scope.statistics.total_streams = response.lifetime.total_streams;
		$scope.statistics.total_smart_objects = response.lifetime.total_smart_objects;

		if (response.lifetime.total_data){
			$scope.statistics.total_data = response.lifetime.total_data.data + response.lifetime.total_data.measures;
			$scope.statistics.total_measures = response.lifetime.total_data.measures;
			$scope.statistics.today_data = response.midnight.total_data.data + response.midnight.total_data.measures;
			$scope.statistics.last_month_data = response.monthly.total_data.data + response.monthly.total_data.measures;
		} else {
			$scope.statistics.total_data = 0;
			$scope.statistics.total_measures = 0;
			$scope.statistics.today_data = 0;
			$scope.statistics.last_month_data = 0;
		}
		
		$scope.statistics.lastupdate = response.datetime.$date;
		var domains= [];
		if (response.lifetime.stream_frequency){
			for (var int = 0; int < response.lifetime.stream_frequency.domain.length; int++) {
				var domain = response.lifetime.stream_frequency.domain[int];
				domains.push({key: $translate(domain._id), y:domain.count});
			}
		}

		$scope.domainChartData = domains;
		
	});
	*/
	
	odataAPIservice.loadDataStatistics().success(function(response) {
		console.debug("statistics", response);	
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
			  "usertypeauth": info.getActiveTenant().usertypeauth
			};
	
	$scope.validationError = {};
	$scope.requestTenant = function(){
		console.log("requestTenant - installationTenantRequest", $scope.installationTenantRequest);
		$scope.validationError = {};
		if(!Helpers.util.isValidEmail($scope.installationTenantRequest.useremail)){
			$scope.validationError.message = 'REQUEST_TENANT_EMAIL_ERROR';
		}
		else{
			$scope.status = 'sending';
			adminAPIservice.createTenant($scope.installationTenantRequest).success(function(response) {
				console.log("createTenant SUCCESS", response);
				$scope.status = 'finish';
				$scope.requestResponse = response;
			}).error(function(response){
				console.error("createTenant ERROR", response);
				$scope.status = 'finish';
				$scope.requestResponse = response;
	
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


//appControllers.controller('HomePageModalCtrl', [ '$scope', '$routeParams', '$location', '$modalInstance', 'info', 'fabricAPIservice', 'adminAPIservice', 'readFilePreview', 'op', 'tenantType', 'globalUser', 'globalUserTenantsToActivate', 
//                                                     function($scope, $routeParams, $location, $modalInstance, info, fabricAPIservice, adminAPIservice, readFilePreview, op, tenantType, globalUser, globalUserTenantsToActivate) {
//
//	console.log("--->info = ", info);
//
//	$scope.showTPForm = false;
//	$scope.resultTPFormKO = false;
//	$scope.resultTPFormOK = false;
//	$scope.showTTForm = false;
//	$scope.resultTTFormKO = false;
//	$scope.resultTTFormOK = false;
//	$scope.authParam = op;
//	$scope.user = globalUser;
//	$scope.userTenantsToActivate = globalUserTenantsToActivate;
//	$scope.tenantType = tenantType;
//	$scope.tenantNew = {};
//	if (typeof(info.getInfo()) != 'undefined' && info.getInfo() != null){
//		$scope.tenantNew.userName = info.getInfo().user.username;
//		$scope.tenantNew.userFirstName = info.getInfo().user.firstname;
//		$scope.tenantNew.userLastName = info.getInfo().user.lastname;
//		$scope.tenantNew.userEmail = info.getInfo().user.email;
//		$scope.userFirstNameTT = info.getInfo().user.firstname;
//		$scope.userLastNameTT = info.getInfo().user.lastname;
//		$scope.userEmailTT = info.getInfo().user.email;
//	} else {
//		$scope.tenantNew.userName = '';
//		$scope.tenantNew.userFirstName = '';
//		$scope.tenantNew.userLastName = '';
//		$scope.tenantNew.userEmail = '';
//		$scope.userFirstNameTT = '';
//		$scope.userLastNameTT = '';
//		$scope.userEmailTT = '';
//		
//		fabricAPIservice.getInfo().success(function(result) {
//			info.setInfo(result);
//			console.log("result", result);
//			console.log("info", info);
//			$scope.activeTenantCode = info.getActiveTenantCode();
//			$scope.userTenants = info.getInfo().user.tenants;
//			$scope.managementUrl = '#/management/virtualentities/'+info.getActiveTenantCode();
//			
//			$scope.tenantNew.userName = info.getInfo().user.username;
//			$scope.tenantNew.userFirstName = info.getInfo().user.firstname;
//			$scope.tenantNew.userLastName = info.getInfo().user.lastname;
//			$scope.tenantNew.userEmail = info.getInfo().user.email;
//			$scope.userFirstNameTT = info.getInfo().user.firstname;
//			$scope.userLastNameTT = info.getInfo().user.lastname;
//			$scope.userEmailTT = info.getInfo().user.email;
//			if ($scope.authParam == 'social')
//				$scope.tenantNew.userTypeAuth = $scope.authParam;
//			else 
//				$scope.tenantNew.userTypeAuth = 'default';
//		});
//	}
//	console.log("$scope.user", $scope.user);
//	if ($scope.authParam == 'social') {
//		$scope.tenantNew.userTypeAuth = $scope.authParam;
//	} else if ($scope.authParam == 'newTT') { //in questo caso solo utenti con credenziali non social possono richiedere tenant (trial) dal menù in alto a dx!
//		$scope.tenantNew.userTypeAuth = 'default';
//		$scope.showTTForm = true;
//	} else if ($scope.authParam == 'newTP') { //in questo caso solo utenti con credenziali non social possono richiedere tenant (personal) dal menù in alto a dx!
//		$scope.tenantNew.userTypeAuth = 'default';
//		$scope.showTPForm = true;
//	} else {
//		$scope.tenantNew.userTypeAuth = 'default';
//	}
//	console.log("--->op = ", op);
//	console.log("--->$scope.tenantTest = ", $scope.tenantNew);
//	
//	console.log("--->info = ", info);
//	$scope.cancel = function () {
//	    $modalInstance.dismiss('cancel');
//	};
//	 
//	$scope.goToRequestor = function () {
//		
//		$scope.tenantNew.userFirstName = $scope.userFirstNameTT;
//		$scope.tenantNew.userLastName = $scope.userLastNameTT;
//		$scope.tenantNew.userEmail = $scope.userEmailTT;
//		
//		$scope.resultTPFormOK = false;
//		$scope.resultTTFormOK = false;
//		$scope.resultTPFormKO = false;
//		$scope.resultTTFormKO = false;
//		
//		$scope.codiceTenantData = {
//			tenantCode: "none"
//		};
//
//		console.log(" ---> $scope.tenantNew = ", $scope.tenantNew);
//		var tenantParam = {};
//		tenantParam.tenant = $scope.tenantNew;
//		console.log(" ---> tenantParam = ", tenantParam);
//		
//		var promise = null;
//		
//		
//		var tenantType  = TENANT_TYPE_TRIAL_ID;
//		if ($scope.showTPForm)
//			tenantType  = TENANT_TYPE_PERSONAL_ID;
//
//		var installationTenantRequest = {
//				  "idTenantType": tenantType,
//				  "useremail": $scope.userEmailTT,
//				  "userfirstname":  $scope.userFirstNameTT,
//				  "userlastname": $scope.userLastNameTT,
//				  "username": $scope,
//				  "usertypeauth": info.getActiveTenant().usertypeauth
//				};
//		
//		
//		
//		if (promise != null){
//			promise.then(function(result) {
//				console.log("result OK => ", result);
//				if ($scope.showTPForm){
//					$scope.resultTPFormOK = true;
//					$scope.user.havePersonalTenantToActivate = true; 
//					$scope.showTPForm = false;
//					$scope.userTenantsToActivate.push(result.data.tenants.tenant);
//				} else {
//					$scope.resultTTFormOK = true;
//					$scope.user.haveTrialTenantToActivate = true; 
//					$scope.showTTForm = false;
//					$scope.userTenantsToActivate.push(result.data.tenants.tenant);
//				}
//				$scope.codiceTenantData.tenantCode = result.data.tenants.tenant.codiceTenant;
//			}, function(result) {
//				console.log("ERROR: ", result);
//				if ($scope.showTPForm){
//					$scope.resultTPFormKO = true;
//				} else {
//					$scope.resultTTFormKO = true;
//				}
//			}, function(result) {
//				console.log('Got notification: ' + result);
//			});
//		}
//	}; 
//	
//	$scope.truthyTTForm = function(field){
//		var rtnResponse = true;
//		switch(field) {
//		    case 'username':
//		        break;
//		    case 'firstname':
//		        if ($scope.tenantNew.userFirstName == null)
//		        	rtnResponse = false;
//		        break;
//		    case 'lastname':
//		        if ($scope.tenantNew.userLastName == null)
//		        	rtnResponse = false;
//		        break;
//		    case 'email':
//		        if ($scope.tenantNew.userEmail == null)
//		        	rtnResponse = false;
//		        break;
//		}
//		return rtnResponse;
//	};
//	
//}]);

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
