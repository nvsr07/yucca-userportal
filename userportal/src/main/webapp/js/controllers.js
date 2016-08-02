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
	
	fabricAPIservice.getInfo().success(function(result) {
		info.setInfo(result);
		$scope.activeTenantCode = info.getActiveTenantCode();
		$scope.userTenants = info.getInfo().user.tenants;
		$scope.userTenantsToActivate = new Array();
		$scope.managementUrl = '#/management/virtualentities/'+info.getActiveTenantCode();
		$scope.user = result.user; 

		$scope.user.haveTrialTenant = false;
		$scope.user.haveTrialTenantToActivate = false;
		$scope.user.havePersonalTenant = false;
		$scope.user.havePersonalTenantToActivate = false;
		angular.forEach($scope.userTenants, function(value, key) {
			  if (value.tenantType == "trial")
				  $scope.user.haveTrialTenant = true;
			});
		angular.forEach($scope.userTenants, function(value, key) {
			  if (value.tenantType == "personal")
				  $scope.user.havePersonalTenant = true;
			});

		userHavePersonalTenant();
		
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
	
	var userHavePersonalTenant = function(){
		fabricAPIservice.getTenants().success(function(result) {
			var actualDate = new Date();	
			if (!$scope.user.havePersonalTenant){
				angular.forEach(result.tenants.tenant, function(value, key) {
					var dataDisVal = null;
					var dataDisDate = null;
					if (typeof(value.dataDisattivazione) != 'undefined' && value.dataDisattivazione != null){
						dataDisVal = value.dataDisattivazione.split('+');
						dataDisDate = new Date(dataDisVal[0]);
					} else {
						dataDisDate = actualDate;
					}
					if ((value.tenantType == "personal") && (value.userName == info.getInfo().user.username) && (actualDate <= dataDisDate) && (value.codDeploymentStatus == "req_inst")){
						$scope.user.havePersonalTenantToActivate = true; 
						$scope.userTenantsToActivate.push(value);
					}
				});
			}
			//userHaveTrialTenant();
		//});
	//}
	
	//var userHaveTrialTenant = function(){
		//fabricAPIservice.getTenants().success(function(result) {
			//var actualDate = new Date();	
			if (!$scope.user.haveTrialTenant){
				angular.forEach(result.tenants.tenant, function(value, key) {
					var dataDisVal = null;
					var dataDisDate = null;
					if (typeof(value.dataDisattivazione) != 'undefined' && value.dataDisattivazione != null){
						dataDisVal = value.dataDisattivazione.split('+');
						dataDisDate = new Date(dataDisVal[0]);
					} else {
						dataDisDate = actualDate;
					}
					if ((value.tenantType == "trial") && (value.userName == info.getInfo().user.username) && (actualDate <= dataDisDate) && (value.codDeploymentStatus == "req_inst")){
						$scope.user.haveTrialTenantToActivate = true; 
						$scope.userTenantsToActivate.push(value);
					}
				});
			}
			gestModalWindow();
		});
	}
	
	var gestModalWindow = function(){

		if (url.indexOf("?") > -1){
			$scope.user.authType = $scope.user.authType || "local";
			if (url.indexOf("strong=false") > -1){  //Compare la modale perchè non hai credenziali strong!
				$scope.openModalWindow('HPModalContent.html', 'HomePageModalCtrl', 'strong', 'notenant');
				$scope.user.authType = "notStrong";
			} else if (url.indexOf("tecnical=true") > -1){
				$scope.user.authType = "tecnical";
				$scope.openModalWindow('HPModalContent.html', 'HomePageModalCtrl', 'tecnical', 'notenant');
			} else if (url.indexOf("tenant=false") > -1){
				if ((!$scope.user.haveTrialTenantToActivate) && (!$scope.user.havePersonalTenantToActivate)){
					if (url.indexOf("social=true") > -1){
						$scope.user.authType = "social";
						$scope.openModalWindow('HPModalContent.html', 'HomePageModalCtrl', 'social', 'notenant');
					} else {
						$scope.openModalWindow('HPModalContent.html', 'HomePageModalCtrl', 'tenant', 'notenant');
					}
				} else {
					//Tutto ok! NO MODAL
				}
			} else {
				//Tutto ok! NO MODAL
			}
			
			if (url.indexOf("social=true") > -1)
				$scope.user.authType = "social";
			
			console.log("user.authType", $scope.user.authType);
				
			if (url.indexOf("login=ok") > -1){
				$scope.linkLoginToStore = "/store/site/pages/sso-filter.jag?requestedPage=%2Fstore%2F";
				$scope.linkLoginToStoreW = "1";
				$scope.linkLoginToStoreH = "1";
			}
		}
	}
	
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
				},
				globalUser: function(){
					return $scope.user;
				},
				globalUserTenantsToActivate: function(){
					return $scope.userTenantsToActivate;
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			$scope.selected = selectedItem;
		}, function() {
			console.info('Modal dismissed at: ' + new Date());
		});
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
		$scope.showTTForm = true;
		$scope.openModalWindow('HPModalContent.html', 'HomePageModalCtrl', 'newTT', tenantType);
	};
	
	$scope.requestTP = function(tenantType){
		$scope.showTPForm = true;
		$scope.openModalWindow('HPModalContent.html', 'HomePageModalCtrl', 'newTP', tenantType);
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
				},
				globalUser: function(){
					return $scope.user;
				},
				globalUserTenantsToActivate: function(){
					return $scope.userTenantsToActivate;
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

appControllers.controller('HomePageModalCtrl', [ '$scope', '$routeParams', '$location', '$modalInstance', 'info', 'fabricAPIservice', 'readFilePreview', 'op', 'tenantType', 'globalUser', 'globalUserTenantsToActivate', 
                                                     function($scope, $routeParams, $location, $modalInstance, info, fabricAPIservice, readFilePreview, op, tenantType, globalUser, globalUserTenantsToActivate) {

	console.log("--->info = ", info);

	$scope.showTPForm = false;
	$scope.resultTPFormKO = false;
	$scope.resultTPFormOK = false;
	$scope.showTTForm = false;
	$scope.resultTTFormKO = false;
	$scope.resultTTFormOK = false;
	$scope.authParam = op;
	$scope.user = globalUser;
	$scope.userTenantsToActivate = globalUserTenantsToActivate;
	$scope.tenantType = tenantType;
	$scope.tenantNew = {};
	if (typeof(info.getInfo()) != 'undefined' && info.getInfo() != null){
		$scope.tenantNew.userName = info.getInfo().user.username;
		$scope.tenantNew.userFirstName = info.getInfo().user.firstname;
		$scope.tenantNew.userLastName = info.getInfo().user.lastname;
		$scope.tenantNew.userEmail = info.getInfo().user.email;
		$scope.userFirstNameTT = info.getInfo().user.firstname;
		$scope.userLastNameTT = info.getInfo().user.lastname;
		$scope.userEmailTT = info.getInfo().user.email;
	} else {
		$scope.tenantNew.userName = '';
		$scope.tenantNew.userFirstName = '';
		$scope.tenantNew.userLastName = '';
		$scope.tenantNew.userEmail = '';
		$scope.userFirstNameTT = '';
		$scope.userLastNameTT = '';
		$scope.userEmailTT = '';
		
		fabricAPIservice.getInfo().success(function(result) {
			info.setInfo(result);
			console.log("result", result);
			console.log("info", info);
			$scope.activeTenantCode = info.getActiveTenantCode();
			$scope.userTenants = info.getInfo().user.tenants;
			$scope.managementUrl = '#/management/virtualentities/'+info.getActiveTenantCode();
			
			$scope.tenantNew.userName = info.getInfo().user.username;
			$scope.tenantNew.userFirstName = info.getInfo().user.firstname;
			$scope.tenantNew.userLastName = info.getInfo().user.lastname;
			$scope.tenantNew.userEmail = info.getInfo().user.email;
			$scope.userFirstNameTT = info.getInfo().user.firstname;
			$scope.userLastNameTT = info.getInfo().user.lastname;
			$scope.userEmailTT = info.getInfo().user.email;
			if ($scope.authParam == 'social')
				$scope.tenantNew.userTypeAuth = $scope.authParam;
			else 
				$scope.tenantNew.userTypeAuth = 'default';
		});
	}
	console.log("$scope.user", $scope.user);
	if ($scope.authParam == 'social') {
		$scope.tenantNew.userTypeAuth = $scope.authParam;
	} else if ($scope.authParam == 'newTT') { //in questo caso solo utenti con credenziali non social possono richiedere tenant (trial) dal menù in alto a dx!
		$scope.tenantNew.userTypeAuth = 'default';
		$scope.showTTForm = true;
	} else if ($scope.authParam == 'newTP') { //in questo caso solo utenti con credenziali non social possono richiedere tenant (personal) dal menù in alto a dx!
		$scope.tenantNew.userTypeAuth = 'default';
		$scope.showTPForm = true;
	} else {
		$scope.tenantNew.userTypeAuth = 'default';
	}
	console.log("--->op = ", op);
	console.log("--->$scope.tenantTest = ", $scope.tenantNew);
	
	console.log("--->info = ", info);
	$scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	};
	 
	$scope.goToRequestor = function () {
		
		$scope.tenantNew.userFirstName = $scope.userFirstNameTT;
		$scope.tenantNew.userLastName = $scope.userLastNameTT;
		$scope.tenantNew.userEmail = $scope.userEmailTT;
		
		$scope.resultTPFormOK = false;
		$scope.resultTTFormOK = false;
		$scope.resultTPFormKO = false;
		$scope.resultTTFormKO = false;
		
		$scope.codiceTenantData = {
			tenantCode: "none"
		};

		console.log(" ---> $scope.tenantNew = ", $scope.tenantNew);
		var tenantParam = {};
		tenantParam.tenant = $scope.tenantNew;
		console.log(" ---> tenantParam = ", tenantParam);
		
		var promise = null;
		if ($scope.showTPForm)
			promise = fabricAPIservice.createNewPersonalTenant(tenantParam);
		else
			promise = fabricAPIservice.createNewTrialTenant(tenantParam);
		
		if (promise != null){
			promise.then(function(result) {
				console.log("result OK => ", result);
				if ($scope.showTPForm){
					$scope.resultTPFormOK = true;
					$scope.user.havePersonalTenantToActivate = true; 
					$scope.showTPForm = false;
					$scope.userTenantsToActivate.push(result.data.tenants.tenant);
				} else {
					$scope.resultTTFormOK = true;
					$scope.user.haveTrialTenantToActivate = true; 
					$scope.showTTForm = false;
					$scope.userTenantsToActivate.push(result.data.tenants.tenant);
				}
				$scope.codiceTenantData.tenantCode = result.data.tenants.tenant.codiceTenant;
			}, function(result) {
				console.log("ERROR: ", result);
				if ($scope.showTPForm){
					$scope.resultTPFormKO = true;
				} else {
					$scope.resultTTFormKO = true;
				}
			}, function(result) {
				console.log('Got notification: ' + result);
			});
		}
	}; 
	
	$scope.truthyTTForm = function(field){
		var rtnResponse = true;
		switch(field) {
		    case 'username':
		        break;
		    case 'firstname':
		        if ($scope.tenantNew.userFirstName == null)
		        	rtnResponse = false;
		        break;
		    case 'lastname':
		        if ($scope.tenantNew.userLastName == null)
		        	rtnResponse = false;
		        break;
		    case 'email':
		        if ($scope.tenantNew.userEmail == null)
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
