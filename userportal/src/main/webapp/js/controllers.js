'use strict';

/* Controllers */

var appControllers = angular.module('userportal.controllers', []);

appControllers.controller('NavigationCtrl', [ '$scope', "$route", '$translate', 'fabricAPIservice',  function($scope, $route, $translate, fabricAPIservice) {
	$scope.$route = $route;
	$scope.managementUrl = null;
	
	fabricAPIservice.getInfo().success(function(response) {
		console.debug("response.info.tenant.tenantCode", response.info.tenant.tenantCode);
		$scope.managementUrl = '#/management/streams/'+response.info.tenant.tenantCode;
	});
	
	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};
} ]);

