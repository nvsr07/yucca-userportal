'use strict';

/* Controllers */

var appControllers = angular.module('userportal.controllers', []);

appControllers.controller('GlobalCtrl', [ '$scope', "$route",'info','$location', 'fabricAPIservice', 'localStorageService', function($scope, $route, info, $location, fabricAPIservice, localStorageService) {
	$scope.$route = $route;

	$scope.storeUrl = '/store/';	
	console.log("storeUrl",$scope.storeUrl);
	
	$scope.isAuthorized = function(operation){
		var authorized = info.isAuthorized(operation);
		return authorized;
	};
	$scope.userTenants = null;
	fabricAPIservice.getInfo().success(function(result) {
		info.setInfo(result);
		$scope.activeTenantCode = info.getActiveTenantCode();
		
		$scope.userTenants = info.getInfo().user.tenants;

		$scope.managementUrl = '#/management/virtualentities/'+info.getActiveTenantCode();
		
		
		$scope.user = result.user;
//		if($scope.user && $scope.user!=null && $scope.user.loggedIn){
//			$scope.storeUrl = '/store/site/pages/sso-filter.jag';
//		}
	});
	
	$scope.changeActiveTenant = function(newTenant){
		info.setActiveTenantCode(newTenant);
		$scope.activeTenantCode = info.getActiveTenantCode();
		$location.path("#/");
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
	
	

} ]);

appControllers.controller('NavigationCtrl', [ '$scope', "$route", '$translate','webSocketService', 'fabricAPIservice', 'info', '$location', function($scope, $route, $translate,webSocketService, fabricAPIservice, info, $location) {
	$scope.$route = $route;
	//$scope.managementUrl = null;
	$scope.currentUrl = function() {
		return encodeURIComponent("#"+$location.path());
	};

	//$scope.user;
	
	console.debug(":::::Client webSocket Singleton::::");
	console.debug("Client webSocket Singleton::::",WebsocketStompSingleton.getInstance());
	
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

//	fabricAPIservice.getInfo().success(function(result) {
//		console.debug("result", result);
//		info.setInfo(result);
//		$scope.managementUrl = '#/management/virtualentities/'+result.tenantCode;
//		$scope.user = result.user;
//	});
	

	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};

//	$scope.isHomepage = function() {
//		return $route.current.isHomepage;
//	};
	

	$scope.isUserLoggedIn = function() {
		return $route.current.isHomepage;
	};
} ]);

appControllers.controller('HomeCtrl', [ '$scope', "$route", '$filter', 'fabricAPIservice', 'fabricAPImanagement', 'info', '$location', 
                                        function($scope, $route, $filter, fabricAPIservice, fabricAPImanagement, info,$location) {
	$scope.$route = $route;
	
	$scope.tenant = "";
	
	var $translate = $filter('translate');
	
	showMap();
	
	$scope.isHomepage = function() {
		return true;
	};
	
	var scrollTo  = $location.search().scrollTo;
	console.debug(" scrollTo",  scrollTo);
	if(scrollTo){
		Helpers.util.scrollTo(scrollTo);
	}
//	$scope.tenant = info.getActiveTenantCode();
//	fabricAPIservice.getInfo().success(function(result) {
//		console.debug("result", result);
//		$scope.tenant = result.tenantCode;
//	});
	
	$scope.statistics = {};
	
	//$scope.domainChartData = [];

	
	fabricAPImanagement.loadDataStatistics().success(function(response) {
		console.debug("statistics", response);	
		$scope.statistics.total_tenants = response.lifetime.total_tenants;
		$scope.statistics.total_streams = response.lifetime.total_streams;
		$scope.statistics.total_smart_objects = response.lifetime.total_smart_objects;
		
		$scope.statistics.total_data = response.lifetime.total_data.data + response.lifetime.total_data.measures;
		$scope.statistics.total_measures = response.lifetime.total_data.measures;
		$scope.statistics.today_data = response.midnight.total_data.data + response.midnight.total_data.measures;
		var domains= [];
		for (var int = 0; int < response.lifetime.stream_frequency.domain.length; int++) {
			var domain = response.lifetime.stream_frequency.domain[int];
			console.log("domain:", domain);
			domains.push({key: $translate(domain._id), y:domain.count});
		}
		
		$scope.domainChartData = domains;
		console.log("$scope.domainChartData",$scope.domainChartData);
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
//		$scope.domainChartData =  [
//	                 	      	{ 
//	                 	      		key: "Agricoltura",
//	                 		        y : 29
//	                 		      } , 
//	                 		      { 
//	                 		        key: "Energia",
//	                 		        y : 13
//	                 		      } , 
//	                 		      { 
//	                 		        key: "Ambiente",
//	                 		        y : 32
//	                 		      } , 
//	                 		      { 
//	                 		        key: "Salute",
//	                 		        y : 19
//	                 		      } , 
//	                 		      { 
//	                 		        key: "Scuola",
//	                 		        y : 5
//	                 		      } , 
//	                 		      { 
//	                 		        key: "Sicurezza",
//	                 		        y : 9
//	                 		      } , 
//	                 		      { 
//	                 		        key: "Trasporti",
//	                 		        y : 25
//	                 		      } 
//	                 		    ];


} ]);

