'use strict';

/* Controllers */

var appControllers = angular.module('userportal.controllers', []);

appControllers.controller('GlobalCtrl', [ '$scope', "$route", '$modal', 'info','$location', '$translate', 'fabricAPIservice', 'localStorageService', function($scope, $route, $modal, info, $location, $translate, fabricAPIservice, localStorageService) {
	$scope.$route = $route;
	
	$scope.linkLoginToStore = "";
	$scope.linkLoginToStoreW = "0";
	$scope.linkLoginToStoreH = "0";
	
	$scope.storeUrl = '/store/';	
	console.log("storeUrl",$scope.storeUrl);

	$scope.isAuthorized = function(operation){
		var authorized = info.isAuthorized(operation);
		return authorized;
	};
	
	$scope.userTenants = null;
	
	var checkTermCondition = function(){
		$scope.activeTenantType = info.getActiveTenantType();
		if($scope.activeTenantType != 'readonly'){
		if(typeof $scope.user.acceptTermConditionTenants == 'undefined')
			$scope.user.acceptTermConditionTenants = [];
		
			if($scope.user.acceptTermConditionTenants.indexOf($scope.activeTenantCode)<0){
				var modalAcceptTermConditionInstance = $modal.open({
					animation : $scope.animationsEnabled,
					templateUrl : 'termAndConditionModal.html',
					controller : 'TermAndConditionModalCtrl',
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
	
	fabricAPIservice.getInfo().success(function(result) {
		info.setInfo(result);
		$scope.activeTenantCode = info.getActiveTenantCode();
		$scope.userTenants = info.getInfo().user.tenants;
		$scope.userTenantsToActivate = new Array();
		$scope.managementUrl = '#/management/virtualentities/'+info.getActiveTenantCode();
		$scope.user = result.user; 
		
		$scope.user.haveTrialTenant = false;
		$scope.user.haveTrialTenantToActivate = false;
		angular.forEach($scope.userTenants, function(value, key) {
		  if (value.tenantType == "trial")
			  $scope.user.haveTrialTenant = true;
		});
		
		if (!$scope.user.haveTrialTenant){
			fabricAPIservice.getTenants().success(function(result) {
				angular.forEach(result.tenants.tenant, function(value, key) {
					var dataDisVal = null;
					var dataDisDate = null;
					if (typeof(value.dataDisattivazione) != 'undefined' && value.dataDisattivazione != null){
						dataDisVal = value.dataDisattivazione.split('+');
						dataDisDate = new Date(dataDisVal[0]);
					} else {
						dataDisDate = new Date();
					}
					var actualDate = new Date();
					console.log("=====> TENANT = ", value);
					console.log("=====> actualDate = ", actualDate);
					console.log("=====> dataDisDate = ", dataDisDate);
					if ((value.tenantType == "trial") && (value.userName == info.getInfo().user.username) && (actualDate <= dataDisDate) && (value.codDeploymentStatus == "req_inst")){
						$scope.user.haveTrialTenantToActivate = true; 
						$scope.userTenantsToActivate.push(value);
					}
				});
			});
		}
		
		
//		if($scope.user && $scope.user!=null && $scope.user.loggedIn){
//			$scope.storeUrl = '/store/site/pages/sso-filter.jag';
//		}
		try{
			$scope.BuildInfo.timestamp = BuildInfo.timestamp;
		} catch (e) {
			if(typeof $scope.BuildInfo == 'undefined')
				$scope.BuildInfo = {};
			$scope.BuildInfo.timestamp = new Date().getMilliseconds();
		}
		checkTermCondition();
//		$scope.activeTenantType = info.getActiveTenantType();
//		if(typeof $scope.user.acceptTermConditionTenants == 'undefined')
//			$scope.user.acceptTermConditionTenants = [];
//		
//		if($scope.user.acceptTermConditionTenants.indexOf($scope.activeTenantCode)<0){
//			var modalAcceptTermConditionInstance = $modal.open({
//				animation : $scope.animationsEnabled,
//				templateUrl : 'termAndConditionModal.html',
//				controller : 'TermAndConditionModalCtrl',
//				keyboard : false,
//				size : 0,
//			      resolve: {
//			    	  activeTenantType: function () {
//			            return $scope.activeTenantType;
//			          }
//			        }
//			});
//
//			modalAcceptTermConditionInstance.result.then(function() {
//				console.log("modalAcceptTermConditionInstance ok");
//			}, function() {
//				console.debug("Not accepted term and conditions");
//				$location.path("/userportal/api/authorize?logout={{user.username}}&returnUrl=%23%2Fhome%3F");
//				console.log("path", $location.path());
//			});
//		}
		console.log('info', info);
		console.log('activeTenantCode', $scope.activeTenantCode);
		console.log('userTenants', $scope.userTenants);
		console.log('userTenantsToActivate', $scope.userTenantsToActivate);
		console.log('managementUrl', $scope.managementUrl);
		console.log('user', $scope.user);
	});
	
	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};

	$scope.changeActiveTenant = function(newTenant){
		fabricAPIservice.getInfoChangActiveTenant(newTenant).success(function(result) {
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
	var url = $location.$$url;
	
	$scope.openModalWindow = function(templateUrlParam, controllerParam, opParam, tenantType){
		var modalInstance = $modal.open({
			animation : $scope.animationsEnabled,
			templateUrl : templateUrlParam,
			controller : controllerParam,
			size : 0,
			backdrop  : 'static',
			keyboard  : false,
			resolve: { 
				op: function () {
					return opParam;
				},
				tenantType: function () {
					return tenantType;
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			$scope.selected = selectedItem;
		}, function() {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	if (url.indexOf("?") > -1){
		if (url.indexOf("strong=false") > -1){
			$scope.openModalWindow('myModalContent.html', 'HomePageModalCtrl', 'strong', 'social');
		} else if (url.indexOf("tenant=false") > -1){
			if (url.indexOf("social=true") > -1){
				$scope.openModalWindow('myModalContent.html', 'HomePageModalCtrl', 'social', 'social');
			} else {
				$scope.openModalWindow('myModalContent.html', 'HomePageModalCtrl', 'tenant', 'social');
			}
		}
			
		if (url.indexOf("login=ok") > -1){
			$scope.linkLoginToStore = "/store/site/pages/sso-filter.jag?requestedPage=%2Fstore%2F";
			$scope.linkLoginToStoreW = "1";
			$scope.linkLoginToStoreH = "1";
		}
	}
}]);


appControllers.factory("initCtrl", function(fabricAPIservice, info, $q) {
    return {
    	"getInfo": function() {
    	    	var promise = fabricAPIservice.getInfo();
    	        promise.success(function(result) {
    	    		info.setInfo(result);
    	    		console.log("result", result);
    	    		console.log("info", info);
    	    		$scope.activeTenantCode = info.getActiveTenantCode();
    	    		$scope.userTenants = info.getInfo().user.tenants;
    	    		$scope.managementUrl = '#/management/virtualentities/'+info.getActiveTenantCode();
    	    		$scope.user = result.user;
    	    		
    	    		$scope.user.haveTrialTenant = false;
    	    		angular.forEach($scope.userTenants, function(value, key) {
    	    		  if (value.tenantType == "trial")
    	    			  $scope.user.haveTrialTenant = true;
    	    		});
    	    	});
    	        return promise;
    	      }
    	};
});

appControllers.controller('NavigationCtrl', [ '$scope', "$route", '$translate','webSocketService', 'fabricAPIservice', '$modal', 'info', '$location', function($scope, $route, $translate, webSocketService, fabricAPIservice, $modal, info, $location) {
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
		$scope.showTTForm = true;
		$scope.openModalWindow('myModalContent.html', 'HomePageModalCtrl', 'newTT', tenantType);
	};
	
	$scope.openModalWindow = function(templateUrlParam, controllerParam, opParam, tenantType){
		var modalInstance = $modal.open({
			animation : $scope.animationsEnabled,
			templateUrl : templateUrlParam,
			controller : controllerParam,
			size : 0,
			backdrop  : 'static',
			keyboard  : false,
			resolve: {
				op: function () {
					return opParam;
				},
				tenantType: function () {
					return tenantType;
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			$scope.selected = selectedItem;
		}, function() {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
}]);

appControllers.controller('HomeCtrl', [ '$scope', '$route', '$http', '$filter', 'fabricAPIservice', 'fabricAPImanagement', '$modal', 'info', '$location', 
                                        function($scope, $route, $http, $filter, fabricAPIservice, fabricAPImanagement, $modal, info, $location) {
	$scope.$route = $route;
	$scope.tenant = "";
	var $translate = $filter('translate');
	showMap();

	$scope.isHomepage = function() {
		return true;
	};
	
	console.debug(" $location",  $location);
	var scrollTo  = $location.search().scrollTo;
	console.debug(" scrollTo",  scrollTo);
	if(scrollTo){
		Helpers.util.scrollTo(scrollTo);
	}
	$scope.statistics = {};

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
//	$scope.domainChartData =  [{ key: "Agricoltura", y : 29
//	} , { key: "Energia", y : 13
//	} , { key: "Ambiente", y : 32
//	} , { key: "Salute", y : 19
//	} , { key: "Scuola", y : 5
//	} , { key: "Sicurezza", y : 9
//	} , { key: "Trasporti", y : 25 }];
	
	$scope.animationsEnabled = true;

} ]);

appControllers.controller('HomePageModalCtrl', [ '$scope', '$routeParams', '$location', '$modalInstance', 'info', 'fabricAPIservice', 'readFilePreview', 'op',
                                                     function($scope, $routeParams, $location, $modalInstance, info, fabricAPIservice, readFilePreview, op, tenantType) {

	console.log("--->info = ", info);
	
	$scope.showTTForm = false;
	$scope.resultTTFormKO = false;
	$scope.resultTTFormOK = false;
	$scope.authParam = op;
	$scope.tenantType = tenantType;
	$scope.tenantTest = {};
	if (typeof(info.getInfo()) != 'undefined' && info.getInfo() != null){
		$scope.tenantTest.userName = info.getInfo().user.username;
		$scope.tenantTest.userFirstName = info.getInfo().user.firstname;
		$scope.tenantTest.userLastName = info.getInfo().user.lastname;
		$scope.tenantTest.userEmail = info.getInfo().user.email;
		$scope.userFirstNameTT = info.getInfo().user.firstname;
		$scope.userLastNameTT = info.getInfo().user.lastname;
		$scope.userEmailTT = info.getInfo().user.email;
	} else {
		$scope.tenantTest.userName = '';
		$scope.tenantTest.userFirstName = '';
		$scope.tenantTest.userLastName = '';
		$scope.tenantTest.userEmail = '';
		$scope.userFirstNameTT = '';
		$scope.userLastNameTT = '';
		$scope.userEmailTT = '';
	}
	if ($scope.authParam == 'social') {
		$scope.tenantTest.userTypeAuth = $scope.authParam;
	} else if ($scope.authParam == 'newTT') {
		$scope.tenantTest.userTypeAuth = 'default';
		$scope.showTTForm = true;
	} else {
		$scope.tenantTest.userTypeAuth = 'default';
	}
	$scope.tenantTest.tenantName = null;
	$scope.tenantTest.tenantDescription = null;
	$scope.tenantTest.tenantPassword = null;
	$scope.tenantTest.idEcosystem = 1;
	$scope.tenantTest.tenantType = "trial";  //Da modificare
	$scope.tenantTest.idOrganization = 38;  //CSI 
	console.log("--->op = ", op);
	console.log("--->$scope.tenantTest = ", $scope.tenantTest);
	
	/*fabricAPIservice.getInfo().success(function(result) {
		info.setInfo(result);
		console.log("result", result);
		console.log("info", info);
		$scope.activeTenantCode = info.getActiveTenantCode();
		$scope.userTenants = info.getInfo().user.tenants;
		$scope.managementUrl = '#/management/virtualentities/'+info.getActiveTenantCode();
		$scope.user = result.user;
		
		$scope.tenantTest.userName = info.getInfo().user.firstname;
		$scope.tenantTest.userLastName = info.getInfo().user.lastname;
		$scope.tenantTest.userEmail = info.getInfo().user.email;
		if ($scope.authParam == 'social')
			$scope.tenantTest.userTypeAuth = $scope.authParam;
		else 
			$scope.tenantTest.userTypeAuth = 'classic';

		$scope.line = 356;
	});*/
	
	console.log("--->info = ", info);
	$scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	};
	
	$scope.goToRequestor = function () {
		
		$scope.tenantTest.userFirstName = $scope.userFirstNameTT;
		$scope.tenantTest.userLastName = $scope.userLastNameTT;
		$scope.tenantTest.userEmail = $scope.userEmailTT;

		console.log(" ---> $scope.tenantTest = ", $scope.tenantTest);
		var tenantParam = {};
		tenantParam.tenant = $scope.tenantTest;
		console.log(" ---> tenantParam = ", tenantParam);
		var promise = fabricAPIservice.createNewTestTenant($scope.tenantTest.tenantName, tenantParam);
		promise.then(function(result) {
			console.log("result OK => ", result);
			$scope.resultTTFormOK = true;
			$scope.showTTForm = false;
		}, function(result) {
			console.log("ERROR: ", result);
			$scope.resultTTFormKO = true;
			$scope.showTTForm = false;
		}, function(result) {
			console.log('Got notification: ' + result);
		});
	}; 
	
	$scope.truthyTTForm = function(field){
		var rtnResponse = true;
		switch(field) {
		    case 'username':
		        break;
		    case 'firstname':
		        if ($scope.tenantTest.userFirstName == null)
		        	rtnResponse = false;
		        break;
		    case 'lastname':
		        if ($scope.tenantTest.userLastName == null)
		        	rtnResponse = false;
		        break;
		    case 'email':
		        if ($scope.tenantTest.userEmail == null)
		        	rtnResponse = false;
		        break;
		}
		return rtnResponse;
	};
	
}]);


appControllers.controller('TermAndConditionModalCtrl', [ '$scope', '$routeParams', '$location', '$modalInstance', 'info', 'fabricAPIservice', 'activeTenantType','$translate',
                                                 function($scope, $routeParams, $location, $modalInstance, info, fabricAPIservice , activeTenantType,$translate) {

	if(typeof activeTenantType == 'undefined' || activeTenantType == null)
		activeTenantType = 'default';
	if(activeTenantType!='trial')
		activeTenantType = 'default';
	$scope.showLoading = false;
	$scope.termConditionContent = 'partials/common/termCondition/termCondition_'+activeTenantType+'_'+$translate.use() +".html";
	$scope.acceptTermAndCondition = function () {
		$scope.showLoading = true;
		fabricAPIservice.acceptTermConditionForTenant(info.getActiveTenantCode()).success(function(info){
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
