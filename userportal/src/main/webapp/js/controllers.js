'use strict';

/* Controllers */

var appControllers = angular.module('userportal.controllers', []);

appControllers.controller('NavigationCtrl', [ '$scope', "$route", '$translate', 'fabricAPIservice',  function($scope, $route, $translate, fabricAPIservice) {
	$scope.$route = $route;
	$scope.managementUrl = null;
	console.debug(":::::Client webSocket Singleton::::");
	console.debug("Client webSocket Singleton::::",WebsocketStompSingleton.getInstance());
	
	$scope.$on('$locationChangeStart', function(event) {
		console.debug("::::: $locationChangeStart ::::");
		if(WebsocketStompSingleton.getInstance()){			
			console.debug(":::::WebsocketStompSingleton.getInstance().cancelAllSubscriptions() ::::");
			WebsocketStompSingleton.getInstance().cancelAllSubscriptions();
		}
	});
	
	
		
	fabricAPIservice.getInfo().success(function(response) {
		console.debug("response.info.tenant.tenantCode", response.info.tenant.tenantCode);
		$scope.managementUrl = '#/management/streams/'+response.info.tenant.tenantCode;
	});
	
	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};
} ]);

