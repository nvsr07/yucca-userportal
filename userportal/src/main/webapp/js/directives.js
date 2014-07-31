'use strict';

/* Directives */
var appDirectives = angular.module('userportal.directives', []);

appDirectives.directive('appVersion', [ 'version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
} ]);

