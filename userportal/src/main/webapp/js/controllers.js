'use strict';

/* Controllers */

var appControllers = angular.module('userportal.controllers', []);

appControllers.controller('NavigationCtrl', [ '$scope', "$route", '$translate', function($scope, $route, $translate) {
	$scope.$route = $route;
	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};
} ]);

