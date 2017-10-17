'use strict';

/* Directives */

appDirectives.directive('discoveryFilter', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/discovery/filter.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('discoveryResultList', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/discovery/results.html?'+BuildInfo.timestamp,
	};
});


appDirectives.directive('discoveryDetailCard', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/discovery/detail-card.html?'+BuildInfo.timestamp,
	};
});
