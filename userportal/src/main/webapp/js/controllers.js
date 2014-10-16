'use strict';

/* Controllers */

var appControllers = angular.module('userportal.controllers', []);

appControllers.controller('NavigationCtrl', [ '$scope', "$route", '$translate','webSocketService', 'fabricAPIservice', 'info', '$location', function($scope, $route, $translate,webSocketService, fabricAPIservice, info, $location) {
	$scope.$route = $route;
	$scope.managementUrl = null;
	$scope.currentUrl = function() {
		return encodeURIComponent("#"+$location.path());
	};

	$scope.user;
	
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

	fabricAPIservice.getInfo().success(function(result) {
		console.debug("result", result);
		$scope.managementUrl = '#/management/virtualentities/'+result.tenantCode;
		info.setInfo(result);
		$scope.user = result.user;
	});
	
	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};
	
	$scope.isHomepage = function() {
		return $route.current.isHomepage;
	};
	

	$scope.isUserLoggedIn = function() {
		return $route.current.isHomepage;
	};
} ]);

appControllers.controller('HomeCtrl', [ '$scope', "$route", '$translate', 'fabricAPIservice', 'info', function($scope, $route, $translate, fabricAPIservice, info) {
	$scope.$route = $route;
	
	$scope.tenant = "";
	
	console.debug("showMap");
	showMap();
	
	fabricAPIservice.getInfo().success(function(result) {
		console.debug("result", result);
		$scope.tenant = result.tenantCode;
	});

//	fabricAPIservice.getInfo().success(function(response) {
//		console.debug("response.info.tenant.tenantCode", response.info.tenant.tenantCode);
//		$scope.tenant = response.info.tenant.tenantCode;
//		info.setInfo(response.info);
//	});
	
	$scope.tenantsCount = "";
	fabricAPIservice.getTenants().success(function(response) {
		console.debug("res1", response);
		$scope.tenantsCount = response.tenants.tenant.length;		
	});

	$scope.virtualentitiesCount = "";
	fabricAPIservice.getVirtualentities("").success(function(response) {
		$scope.virtualentitiesCount = response.virtualEntities.virtualEntity.length;		
	});

	$scope.streamsCount = "";
	fabricAPIservice.getStreams("").success(function(response) {
		$scope.streamsCount = response.streams.stream.length;		
	});

//	$scope.changeLanguage = function(langKey) {
//		$translate.use(langKey);
//	};
} ]);
