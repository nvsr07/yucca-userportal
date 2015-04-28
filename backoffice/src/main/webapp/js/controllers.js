'use strict';

/* Controllers */

var appControllers = angular.module('backoffice.controllers', []);

appControllers.controller('GlobalCtrl', [ '$scope', "$route",'info','$location', '$translate', 'fabricAPIservice', 'localStorageService', function($scope, $route, info, $location, $translate, fabricAPIservice, localStorageService) {
	$scope.$route = $route;


	$scope.isAuthorized = function(operation){
		var authorized = info.isAuthorized(operation);
		return authorized;
	};
	fabricAPIservice.getInfo().success(function(result) {
		info.setInfo(result);
		$scope.activeTenantCode = info.getActiveTenantCode();

		$scope.user = result.user;
	});

	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};


	$scope.isHomepage = function() {
		if($location.path().substring(0, 5) === "/dashboard"){
			return true;
		}	
		return false;
	};

	var scrollTo  = $location.search().scrollTo;
	console.debug(" scrollTo",  scrollTo);
	if(scrollTo){
		Helpers.util.scrollTo(scrollTo);
	}


} ]);

appControllers.controller('HomeCtrl', [ '$scope', "$route", '$filter', 'fabricAPIservice', 'fabricAPImanagement', 'info', '$location', 
                                        function($scope, $route, $filter, fabricAPIservice, fabricAPImanagement, info,$location) {
	$scope.$route = $route;

	$scope.tenant = "";

	var $translate = $filter('translate');


	$scope.isHomepage = function() {
		return true;
	};

} ]);

