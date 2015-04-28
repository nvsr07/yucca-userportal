'use strict';
var appDirectives = appDirectives || angular.module('backoffice.directives', []);


appDirectives.directive('dashboardStreams', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dashboard/streams.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('dashboardTenants', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dashboard/tenants.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('dashboardUsers', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dashboard/users.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('dashboardStreamDetail', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dashboard/streamDetail.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('dashboardTenantDetail', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dashboard/tenantDetail.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('dashboardUserDetail', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dashboard/userDetail.html?'+BuildInfo.timestamp,
	};
});

