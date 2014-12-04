'use strict';

/* Directives */

appDirectives.directive('newDatasetWizardStart', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/new-dataset-start.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('newDatasetWizardRequestor', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/new-dataset-requestor.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('newDatasetWizardMetadata', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/new-dataset-metadata.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('newDatasetWizardUpload', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/new-dataset-upload.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('newDatasetWizardColumns', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/new-dataset-columns.html?'+BuildInfo.timestamp,
	};
});
