appServices.factory('adminAPIservice', [ "$http", "$q", "info", function($http, $q, info) {

	var adminAPI = {};

	adminAPI.loadTenants = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_TENANTS_URL + '?callback=JSON_CALLBACK'
		});
	};
	
	

	adminAPI.loadSOCategories = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_SO_CATEGORIES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadSOTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_SO_TYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadDomains = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DOMAINS_URL + '/' + '?ecosystemCode=SDNET&callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadSubDomains = function(domain) {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_SUBDOMAINS_URL + '/' + '?domainCode=' + domain + '&callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadTags = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_TAGS_URL + '/' + '?ecosystemCode=SDNET&callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadPhenomenons = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_PHENOMENONS_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadMeasureUnits = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_MEASURE_UNITS_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadDataTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DATA_TYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadDatasetSubtypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DATASET_SUBTYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadDatasetTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DATASET_TYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadEcosystems = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_ECOSYSTEMS_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadExposureTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_EXPOSURE_TYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadLicenses = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_LICENSES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadLocationTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_LOCATION_TYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadOrganizations = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_ORGANIZATIONS_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadSupplyTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_SUPPLY_TYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.getVirtualentity = function(tenant_code, virtualentity_code) {
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_VIRTUALENTITY_URL + tenant_code + '/' + virtualentity_code + '/' + '?callback=JSON_CALLBACK'
		});
	};

	return adminAPI;
} ]);
