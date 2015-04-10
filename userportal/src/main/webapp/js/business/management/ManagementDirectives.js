'use strict';

/* Directives */

/* new dataset */

appDirectives.directive('newDatasetWizardStart', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/dataset/new-dataset-start.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('newDatasetWizardRequestor', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/dataset/new-dataset-requestor.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('newDatasetWizardMetadata', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/dataset/new-dataset-metadata.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('newDatasetWizardChoosetype', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/dataset/new-dataset-choose-type.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('newDatasetWizardUpload', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/dataset/new-dataset-upload.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('newDatasetWizardColumns', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/dataset/new-dataset-columns.html?'+BuildInfo.timestamp,
	};
});

/* stream */
appDirectives.directive('newStreamWizardRegister', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/stream/new-stream-register.html?'+BuildInfo.timestamp,
	};
});
appDirectives.directive('newStreamWizardRequestor', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/stream/new-stream-requestor.html?'+BuildInfo.timestamp,
	};
});
appDirectives.directive('newStreamWizardDetail', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/stream/new-stream-detail.html?'+BuildInfo.timestamp,
	};
});
appDirectives.directive('newStreamWizardComponents', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/stream/new-stream-components.html?'+BuildInfo.timestamp,
	};
});
appDirectives.directive('newStreamWizardShare', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/stream/new-stream-share.html?'+BuildInfo.timestamp,
	};
});

/* virtual entity */
appDirectives.directive('newVirtualentityWizardRegister', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/virtualentity/new-virtualentity-register.html?'+BuildInfo.timestamp,
	};
});
appDirectives.directive('newVirtualentityWizardPosition', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/virtualentity/new-virtualentity-position.html?'+BuildInfo.timestamp,
	};
});
appDirectives.directive('newVirtualentityWizardDetail', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/virtualentity/new-virtualentity-detail.html?'+BuildInfo.timestamp,
	};
});
