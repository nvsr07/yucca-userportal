'use strict';

/* Directives */

appDirectives.directive('dataexplorerSidebarFilter', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dataexplorer/sidebar-filter.html?'+BuildInfo.timestamp,
	};
});


appDirectives.directive('dataexplorerSidebarMetadatadetail', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dataexplorer/sidebar-metadata-detail.html?'+BuildInfo.timestamp,
	};
});


