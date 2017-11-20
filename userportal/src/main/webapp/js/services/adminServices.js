appServices.factory('adminAPIservice', [ "$http", "$q", "info", function($http, $q, info) {

	var adminAPI = {};

	adminAPI.loadSOCategories = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_SO_CATEGORIES_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadSOTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_SO_TYPES_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadDomains = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DOMAINS_URL + '/?ecosystemCode=SDNET&callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadSubDomains = function(domain) {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_SUBDOMAINS_URL + '/?domainCode=' + domain + '&callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadTags = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_TAGS_URL + '/?ecosystemCode=SDNET&callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadPhenomenons = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_PHENOMENONS_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadMeasureUnits = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_MEASURE_UNITS_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadDataTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DATA_TYPES_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadDatasetSubtypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DATASET_SUBTYPES_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadDatasetTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DATASET_TYPES_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadEcosystems = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_ECOSYSTEMS_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadExposureTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_EXPOSURE_TYPES_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadLicenses = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_LICENSES_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadLocationTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_LOCATION_TYPES_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadOrganizations = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_ORGANIZATIONS_URL + '/?ecosystemCode=SDNET&callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadSupplyTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_SUPPLY_TYPES_URL + '/?callback=JSON_CALLBACK'
		});
	};


	
	/**
	 * TENANTS
	 */
	adminAPI.loadTenants = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_TENANTS_URL + '?callback=JSON_CALLBACK'
		});
	};
	
	adminAPI.createTenant = function(installationTenantRequest) {
		var urlWithParam = Constants.API_ADMIN_TENANTS_URL;
		return $http.post(urlWithParam, installationTenantRequest);
	};
	
	/**
	 * SMART OBJECTS
	 */
	adminAPI.loadSmartobjectsOfOrganization = function(activeTenant) {
		var urlWithParam = Constants.API_ADMIN_SMARTOBJECTS_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organizationCode) + '/?callback=JSON_CALLBACK'; 
		return $http({
			method : 'JSONP',
			url : urlWithParam
		});
	};

	adminAPI.loadSmartobjects = function(activeTenant) {
		var urlWithParam = Constants.API_ADMIN_SMARTOBJECTS_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organizationCode) + '/?tenantCode='+activeTenant.tenantCode+'&callback=JSON_CALLBACK'; 
		return $http({
			method : 'JSONP',
			url : urlWithParam
		});
	};

	adminAPI.loadSmartobject = function(activeTenant, soode) {
		var urlWithParam = Constants.API_ADMIN_SMARTOBJECTS_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organizationCode) + '/' +soode + '/?callback=JSON_CALLBACK'; 
		return $http({
			method : 'JSONP',
			url : urlWithParam
		});
	};
	
	adminAPI.createSmartobject = function(activeTenant, so) {
		var urlWithParam = Constants.API_ADMIN_SMARTOBJECTS_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organizationCode);
		return $http.post(urlWithParam, so);
	};

	adminAPI.updateSmartobject = function(activeTenant, so) {
		var urlWithParam = Constants.API_ADMIN_SMARTOBJECTS_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organizationCode) + '/' +so.socode;
		return $http.put(urlWithParam, so);
	};

	
	/**
	 * STREAMS
	 */
	adminAPI.loadStreams = function(activeTenant, tenantCodeManager) {
		var urlWithParam = Constants.API_ADMIN_STREAM_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organizationCode) + '/?callback=JSON_CALLBACK'; 
		if(tenantCodeManager && tenantCodeManager!=null && tenantCodeManager!= "")
			urlWithParam += "&tenantCodeManager" + tenantCodeManager;
		return $http({
			method : 'JSONP',
			url : urlWithParam
		});
	};
	
	adminAPI.loadStream = function(activeTenant, idstream) {
		var urlWithParam = Constants.API_ADMIN_STREAM_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organizationCode) + '/' +idstream+ '/?callback=JSON_CALLBACK'; 
		return $http({
			method : 'JSONP',
			url : urlWithParam
		});
	};
	

	adminAPI.createStream = function(activeTenant, soCode, stream) {
		var urlWithParam = Constants.API_ADMIN_STREAM_UPDATE_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organizationCode).replace(new RegExp('{soCode}', 'gi'), soCode);
		return $http.post(urlWithParam, stream);
	};
	
	adminAPI.updateStream = function(activeTenant, soCode, stream) {
		var urlWithParam = Constants.API_ADMIN_STREAM_UPDATE_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organizationCode).replace(new RegExp('{soCode}', 'gi'), soCode) + '/' +streamCode;
		return $http.put(urlWithParam, stream);
	};
	
	

	return adminAPI;
} ]);
