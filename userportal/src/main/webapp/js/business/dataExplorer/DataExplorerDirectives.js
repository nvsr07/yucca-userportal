'use strict';

/* Directives */

appDirectives.directive('dataexplorerSidebarFilter', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dataexplorer/dataexplorer/sidebar-filter.html?'+BuildInfo.timestamp,
	};
});


appDirectives.directive('dataexplorerSidebarMetadatadetail', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dataexplorer/dataexplorer/sidebar-metadata-detail.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('databrowserDomains', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dataexplorer/databrowser/domains.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('databrowserTags', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dataexplorer/databrowser/tags.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('databrowserResults', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dataexplorer/databrowser/results.html?'+BuildInfo.timestamp,
	};
});

