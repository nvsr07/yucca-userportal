'use strict';

/* Controllers */

var appControllers = angular.module('userportal.controllers', []);

appControllers.controller('NavigationCtrl', [ '$scope', "$route", '$translate', 'fabricAPIservice', 'info', function($scope, $route, $translate, fabricAPIservice, info) {
	$scope.$route = $route;
	$scope.managementUrl = null;
	$scope.isHomepage = function() {
		
		return $route.current.isHomepage;
	};

	
	fabricAPIservice.getInfo().success(function(response) {
		console.debug("response.info.tenant.tenantCode", response.info.tenant.tenantCode);
		$scope.managementUrl = '#/management/streams/'+response.info.tenant.tenantCode;
		info.setInfo(response.info);
	});
	
	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};
} ]);

appControllers.controller('HomeCtrl', [ '$scope', "$route", '$translate', 'fabricAPIservice', 'info', function($scope, $route, $translate, fabricAPIservice, info) {
	$scope.$route = $route;
	
	$scope.tenant = "";
	
	fabricAPIservice.getInfo().success(function(response) {
		console.debug("response.info.tenant.tenantCode", response.info.tenant.tenantCode);
		$scope.tenant = response.info.tenant.tenantCode;
		info.setInfo(response.info);
	});
	
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

	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};
} ]);

