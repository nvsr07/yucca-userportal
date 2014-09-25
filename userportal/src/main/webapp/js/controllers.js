'use strict';

/* Controllers */

var appControllers = angular.module('userportal.controllers', []);

appControllers.controller('NavigationCtrl', [ '$scope', "$route", '$translate', 'fabricAPIservice', 'info', function($scope, $route, $translate, fabricAPIservice, info) {
	$scope.$route = $route;
	$scope.managementUrl = null;
	
	fabricAPIservice.getInfo().success(function(response) {
		console.debug("response.info.tenant.tenantCode", response.info.tenant.tenantCode);
		$scope.managementUrl = '#/management/streams/'+response.info.tenant.tenantCode;
		info.setInfo(response.info);
	});
	
	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};
} ]);

