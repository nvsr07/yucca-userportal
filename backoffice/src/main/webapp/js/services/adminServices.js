//20171023 - Nuova js per chiamata alle nuove url delle API

appServices.factory('adminAPIservice', [ "$http", "$q", "info", function($http, $q, info) {

	var adminAPI = {};

	adminAPI.loadTenants = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_TENANTS_URL + '?callback=JSON_CALLBACK'
		});
	};
	
	adminAPI.loadOrganizations = function() {
		return $http({method : 'JSONP',
			url : Constants.API_ADMIN_ORGANIZATIONS_URL + '/' + '?ecosystemCode=SDNET&callback=JSON_CALLBACK'
		});
	};	
	
	adminAPI.loadTenantTypes = function() {
		return $http({method : 'JSONP',
			url : Constants.API_ADMIN_TENANTTYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};	
	
	adminAPI.createTenant = function(tenant) {
		var deferred = $q.defer();
		var resultData = null;
		console.debug("Tenant", tenant);
		return $http.post(Constants.API_ADMIN_TENANTS_URL , tenant);
	};
	
	adminAPI.execAction = function(operations,tenantCode) {
		console.log("execAction - operations", operations,tenantCode);
		
		return $http({
			method : 'PUT',
			data:operations,
			url : Constants.API_ADMIN_TENANTS_URL+"/"+tenantCode+"/action"
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
	
	adminAPI.loadStreams = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_STREAMS_URL + '?callback=JSON_CALLBACK'
		});
	};
	
	adminAPI.execStreamAction = function(operations,idStream) {
		console.log("execAction - operations", operations,idStream);
		
		return $http({
			method : 'PUT',
			data:operations,
			url : Constants.API_ADMIN_STREAMS_URL+"/"+idStream+"/action"
		});
	};
	
	adminAPI.loadTenantInstallationMail = function(tenant_code) {
		var urlCreatiomail = Constants.API_SERVICES_TENANT_URL + tenant_code + '?callback=JSON_CALLBACK';
 		return $http({
			method : 'JSONP',
			url : urlCreatiomail
		});
	};

	return adminAPI;
} ]);
